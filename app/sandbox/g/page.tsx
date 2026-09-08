import { Stage } from "../Stage";
import { ShaderField } from "../ShaderStage";

export const metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <style>{`body > .field:first-of-type { display: none !important; }`}</style>
      <ShaderField kind="grain" />
      <Stage sheets={null} label="вариант g · grain" bare />
    </>
  );
}
