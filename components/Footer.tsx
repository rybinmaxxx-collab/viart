import { footer, site } from "@/content/viart";
import { Reveal } from "@/components/motion";
import { M } from "@/components/m";

/**
 * Footer.
 *
 * Measured: a wider column than the page bands (1200 vs 1120), grid of
 * 3 columns at desktop dropping to 2 below, gap 40 throughout.
 *
 * It gets the same treatment as the bands above it — the seam draws
 * itself, the columns come up in order — so the page ends deliberately
 * rather than just stopping.
 */
export function Footer() {
  return (
    <footer className="relative px-5 pb-10 pt-band text-white lg:pt-band-lg">
      <div aria-hidden className="bloom -top-32 left-1/3 h-72 w-[36rem] bg-lav/15" />

      <Reveal variant="none" step={120} className="relative mx-auto max-w-footer">
        <div className="grid grid-cols-2 gap-10 pb-12 lg:grid-cols-4">
          <M variant="rise" i={0} className="col-span-2 lg:col-span-1">
            <p className="text-h2 font-bold tracking-[-0.04em]">{site.name}</p>
            <p className="mt-3 max-w-xs text-body text-white/72">{site.tagline}</p>
            <p className="mt-5 text-cap text-white/54">
              5,0 на Яндекс Картах · «Хорошее место 2026»
            </p>
          </M>

          {footer.columns.map((col, i) => (
            <M key={col.title} variant="rise" i={i + 1}>
              <p className="text-cap font-medium uppercase tracking-[0.12em] text-white/54">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-body text-white transition-colors hover:text-lav-soft"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </M>
          ))}
        </div>

        <M variant="draw" i={4} duration={1200} className="seam" />

        <M
          variant="fade"
          i={5}
          className="flex flex-col gap-2 pt-6 text-cap text-white/54 sm:flex-row sm:justify-between"
        >
          <span>
            {site.city}, {site.address} · {site.hours}
          </span>
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
        </M>
      </Reveal>
    </footer>
  );
}
