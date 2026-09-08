import { Stage } from "../Stage";
import { ShaderField } from "../ShaderStage";

export const metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <style>{`body > .field:first-of-type { display: none !important; }`}</style>
      <ShaderField kind="rays" />
      <Stage sheets={null} label="вариант f · rays" bare />
    </>
  );
}
