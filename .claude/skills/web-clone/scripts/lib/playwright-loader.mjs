import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

// Resolve a module inside the global node_modules of the running node install,
// e.g. /opt/node22/bin/node -> /opt/node22/lib/node_modules/<name>.
function globalNodeModules(name) {
  const prefix = path.dirname(path.dirname(process.execPath));
  return path.join(prefix, "lib", "node_modules", name);
}

export function loadPlaywright() {
  const candidates = [
    process.env.PLAYWRIGHT_MODULE_PATH,
    "playwright",
    // Globally installed playwright (resolved from the active node prefix).
    globalNodeModules("playwright"),
    globalNodeModules("@playwright/mcp/node_modules/playwright"),
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {
      // Try next candidate.
    }
  }
  throw new Error("Playwright not found. Run `npm install -D playwright` in the clone project, or install the Browser skill dependencies.");
}

// Honour an outbound HTTP(S) proxy when the environment mandates one.
function proxyOption() {
  const server = process.env.HTTPS_PROXY || process.env.https_proxy
    || process.env.HTTP_PROXY || process.env.http_proxy;
  if (!server) return {};
  const bypass = (process.env.NO_PROXY || process.env.no_proxy || "")
    .split(",").map((s) => s.trim()).filter(Boolean).join(",");
  return { proxy: bypass ? { server, bypass } : { server } };
}

export async function launchChromium(chromium) {
  const opts = { headless: true, ...proxyOption() };
  try {
    return await chromium.launch(opts);
  } catch (firstError) {
    try {
      return await chromium.launch({ ...opts, channel: "chrome" });
    } catch {
      throw firstError;
    }
  }
}
