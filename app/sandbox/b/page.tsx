import { Stage } from "../Stage";
import { PRESETS } from "../presets";

export const metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <Stage sheets={PRESETS.b} label="вариант b" />;
}
