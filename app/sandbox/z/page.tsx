import { Stage } from "../Stage";
import { ShaderField } from "../ShaderStage";
import { DepthLayer, type Obj } from "../Depth";

export const metadata = { robots: { index: false, follow: false } };

/**
 * The one that answers the actual question: a shader field for atmosphere,
 * and real objects at three depths travelling at three speeds over it.
 * The SVGs are placeholders standing in for cut-out art.
 */
const objects: Obj[] = [
  // Far — barely moves, sets the room.
  { depth: 0.88, top: "6vh", left: "-6vw", width: "42vw", src: "/sandbox/arch.svg", opacity: 0.5, blur: 1 },
  { depth: 0.84, top: "40vh", right: "-4vw", width: "34vw", src: "/sandbox/arch.svg", opacity: 0.4, blur: 1.5 },
  // Middle.
  { depth: 0.62, top: "62vh", left: "8vw", width: "16vw", src: "/sandbox/ring.svg", opacity: 0.65, rotate: -8 },
  { depth: 0.58, top: "18vh", right: "12vw", width: "13vw", src: "/sandbox/ring.svg", opacity: 0.5, rotate: 14 },
  // Near — travels fastest, sits softest.
  { depth: 0.3, top: "70vh", left: "-3vw", width: "20vw", src: "/sandbox/frond.svg", opacity: 0.6, rotate: 12 },
  { depth: 0.26, top: "-8vh", right: "6vw", width: "17vw", src: "/sandbox/frond.svg", opacity: 0.5, rotate: -160 },
  { depth: 0.18, top: "34vh", left: "26vw", width: "9vw", src: "/sandbox/spark.svg", opacity: 0.7 },
];

export default function Page() {
  return (
    <>
      <style>{`body > .field:first-of-type { display: none !important; }`}</style>
      <ShaderField kind="rays" />
      <DepthLayer objects={objects} />
      <Stage sheets={null} label="вариант z · шейдер + предметы на трёх глубинах" bare />
    </>
  );
}
