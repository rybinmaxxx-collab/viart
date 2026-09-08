import { Stage } from "../Stage";
import { ShaderField } from "../ShaderStage";

export const metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <style>{`body > .field:first-of-type { display: none !important; }`}</style>
      <ShaderField kind="mesh" step={2} />
      <Stage sheets={null} label="вариант e2 · mesh, ступень 2 из 3" bare />
    </>
  );
}
