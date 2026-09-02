import { Band, Button, PageHeader } from "@/components/ui";
import { Reveal, Accordion } from "@/components/motion";
import { M } from "@/components/m";
import { faq, site } from "@/content/viart";

export const metadata = { title: "Вопросы — ViART" };

/**
 * FAQ.
 *
 * A title, the list, and one quiet line at the bottom pointing at the next
 * place to ask. Nothing else — no card of reassurance halfway down, no
 * second conversion band.
 *
 * That restraint is the design of the page. Someone on an FAQ has a
 * specific question and is scanning for it; every block between the title
 * and the list is one more thing to scroll past, and a band selling the
 * thing they have not decided on yet answers nobody.
 *
 * Signature motion: the questions curtain down the column in order, and
 * each answer opens by growing its row rather than by appearing.
 */
export default function Page() {
  return (
    <>
      <PageHeader title={faq.title} lead={faq.lead} />

      <Band>
        <div className="mx-auto max-w-3xl">
          <Reveal variant="none" step={90}>
            {/* One block, one observer: the items curtain down in order. */}
            <M variant="curtain" i={0}>
              <Accordion items={faq.items} />
            </M>
          </Reveal>

          <Reveal variant="fade" delay={200} className="mt-12 text-center">
            <p className="text-body text-white/80">
              Не нашли свой вопрос? Напишите в WhatsApp или позвоните: {site.phone}.
            </p>
            <div className="mt-5">
              <Button href={site.whatsapp} variant="outline">
                Написать в WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>
      </Band>

      <Band glow="lav">
        <Reveal variant="none" step={120} className="mx-auto max-w-xl text-center">
          <M variant="rise" i={0} as="h2" className="text-balance text-h1 font-bold">
            {faq.closing.title}
          </M>
          <M variant="rise" i={1} as="p" className="mt-5 text-lead text-white/80">
            {faq.closing.body}
          </M>
          <M variant="pop" i={2} className="mt-9">
            <Button href={faq.closing.cta.href}>{faq.closing.cta.label}</Button>
          </M>
        </Reveal>
      </Band>
    </>
  );
}
