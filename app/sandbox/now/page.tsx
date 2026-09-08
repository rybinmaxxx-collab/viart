import { Stage } from "../Stage";

export const metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <Stage sheets={null} label="сейчас (как на сайте)" />;
}
