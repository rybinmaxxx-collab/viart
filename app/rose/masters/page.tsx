import Masters from "../../masters/page";

/** `/masters` under the rose preset. See app/rose/page.tsx. */
export const metadata = { title: "Мастер — ViART", robots: { index: false, follow: false } };

export default function RoseMasters() {
  return <Masters />;
}
