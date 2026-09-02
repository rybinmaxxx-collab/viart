import Faq from "../../faq/page";

/** `/faq` under the rose preset. See app/rose/page.tsx. */
export const metadata = { title: "Вопросы — ViART", robots: { index: false, follow: false } };

export default function RoseFaq() {
  return <Faq />;
}
