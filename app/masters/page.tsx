import { Band, Button, PageHeader, SectionHead, Card, Heading } from "@/components/ui";
import { MediaFrame } from "@/components/MediaFrame";
import { Reveal } from "@/components/motion";
import { M } from "@/components/m";
import { master, reviews, site } from "@/content/viart";

export const metadata = { title: "Мастер — ViART" };

/**
 * The master.
 *
 * The page is about safety, delicacy and where a client's boundaries are —
 * not about a package — so it is built the way the reference builds a
 * practice rather than a product: a centred head, one picture, and short
 * labelled paragraphs beside it.
 *
 * It ends on what customers say, which is the strongest thing this studio
 * has: a 5,0 across ninety-eight reviews, and Anna named by name in most
 * of them.
 *
 * Signature motion: two frames slide in from opposite corners and the
 * portrait wipes open between them — the page is about one person, so the
 * one image gets the whole entrance.
 */
export default function Page() {
  // Every review that names her, in its author's own words.
  const named = [...reviews.items, ...reviews.more].filter((r) =>
    /Ан(на|ю|е|и)|Аня|Ане/.test(r.text),
  );

  return (
    <>
      <PageHeader title="Анна. Специалист аппаратной эстетики ViART." lead={master.intro}>
        <Button href={master.primary.href}>{master.primary.label}</Button>
        <Button href={site.whatsapp} variant="outline">
          Спросить в WhatsApp
        </Button>
      </PageHeader>

      {/*
        The quote, and the one portrait.

        Set as a quotation rather than as another heading: it is her saying
        something, and the whole page turns on the difference between the
        studio describing itself and the person doing the work speaking.
      */}
      <Band>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal variant="none" step={130} className="relative order-2 lg:order-none">
            <M
              variant="fromLeft"
              i={0}
              className="absolute -left-3 -top-3 h-full w-full rounded-2xl border border-dashed border-lav/40"
            />
            <M
              variant="fromRight"
              i={1}
              className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl bg-lav/10"
            />
            <M
              variant="wipe"
              i={2}
              duration={1300}
              className="relative overflow-hidden rounded-2xl border border-white/10"
            >
              <MediaFrame
                ratio={4 / 3}
                src={master.photo.src}
                label={master.photo.alt}
                rounded={false}
              />
            </M>
          </Reveal>

          <Reveal variant="none" step={120} className="order-1 lg:order-none">
            <M
              variant="draw"
              i={0}
              duration={900}
              className="h-1 w-14 rounded-full bg-lav shadow-[0_0_24px_rgb(var(--c-accent)/0.55)]"
            />
            <M variant="rise" i={1}>
              {/* A quotation, not a heading. It was set at heading size and
                  heading weight, which made a sentence somebody says out
                  loud land like a billboard. Its own size, one weight
                  down, and it reads as a voice again. */}
              <blockquote className="mt-6 text-balance text-quote font-medium text-white/92">
                «{master.quote.text}»
              </blockquote>
            </M>
            <M variant="rise" i={2} as="p" className="mt-6 max-w-xl text-body text-white">
              {master.quote.body}
            </M>
            <M
              variant="rise"
              i={3}
              as="p"
              className="mt-6 text-cap uppercase tracking-[0.14em] text-lav-soft"
            >
              {master.name} · {master.role}
            </M>
          </Reveal>
        </div>
      </Band>

      {/* How a session goes — the three things that do not depend on
          whether it is a first visit or a tenth. */}
      <Band glow="lav">
        <SectionHead title={master.aboutTitle} lead={master.aboutLead} />

        <Reveal variant="none" step={140} className="mt-14 grid gap-6 md:grid-cols-3">
          {master.about.map((item, i) => (
            <M key={item.title} variant="rise" i={i} duration={950} className="h-full">
              <Card className="flex h-full flex-col p-6 md:p-7">
                <span
                  aria-hidden
                  className="mb-5 block h-1 w-10 rounded-full bg-lav shadow-[0_0_20px_rgb(var(--c-accent)/0.55)]"
                />
                <Heading level={3} size="h3" className="text-lav-soft">
                  {item.title}
                </Heading>
                <p className="mt-3 text-body text-white">{item.body}</p>
              </Card>
            </M>
          ))}
        </Reveal>

        <Reveal
          variant="none"
          step={110}
          as="dl"
          className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-3"
        >
          {master.facts.map(([k, v], i) => (
            <M key={k} variant="rise" i={i} className="text-center">
              <dt className="text-cap uppercase tracking-[0.12em] text-white/58">{k}</dt>
              <dd className="mt-2 text-h3 font-semibold text-white">{v}</dd>
            </M>
          ))}
        </Reveal>

        {/* Renders only once someone fills the rows in — see the note on
            `master.credentials`. Training and years are the facts a visitor
            weighs a master by, and the ones nobody should invent. */}
        {master.credentials.length > 0 && (
          <Reveal
            variant="none"
            step={110}
            as="dl"
            className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-3"
          >
            {master.credentials.map(([k, v], i) => (
              <M key={k} variant="rise" i={i} className="text-center">
                <dt className="text-cap uppercase tracking-[0.12em] text-white/58">{k}</dt>
                <dd className="mt-2 text-h3 font-semibold text-white">{v}</dd>
              </M>
            ))}
          </Reveal>
        )}
      </Band>

      {/* Why clients come back, and the way to book her. */}
      <Band>
        <Reveal variant="none" step={120} className="mx-auto max-w-2xl text-center">
          <M
            variant="draw"
            i={0}
            duration={900}
            className="mx-auto h-1 w-14 rounded-full bg-lav shadow-[0_0_24px_rgb(var(--c-accent)/0.55)]"
          />
          <M variant="rise" i={1} as="h2" className="mt-6 text-balance text-h1 font-bold">
            {master.trust.title}
          </M>
          <M variant="rise" i={2} as="p" className="mt-6 text-lead text-white">
            {master.trust.body}
          </M>
          <M variant="pop" i={3} className="mt-9">
            <Button href={master.trust.cta.href}>{master.trust.cta.label}</Button>
          </M>
          <M variant="fade" i={4} as="p" className="mx-auto mt-5 max-w-md text-cap text-white/62">
            {master.trust.note}
          </M>
        </Reveal>
      </Band>

      {/* What customers say, at the end — every review that names her. */}
      <Band>
        <SectionHead
          title="Что пишут об Анне"
          lead={`${reviews.sourceLabel}. Ниже — те, где её называют по имени.`}
        />

        <Reveal
          variant="none"
          step={120}
          className="mt-14 columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid"
        >
          {named.map((r, i) => (
            <M key={`${r.author}-${i}`} variant="rise" i={Math.min(i, 6)}>
              <Card className="p-5 md:p-6">
                <p aria-label={`${r.stars} из 5`} className="text-body tracking-[0.2em] text-gold">
                  {"★".repeat(r.stars)}
                </p>
                <p className="mt-3 text-body leading-relaxed text-white/88">{r.text}</p>
                <p className="mt-4 text-cap text-white/58">
                  {r.author} · {r.date} · Яндекс Карты
                </p>
              </Card>
            </M>
          ))}
        </Reveal>

        <Reveal variant="fade" delay={200} className="mt-10 text-center">
          <a
            href={reviews.source}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-fade text-cap text-white/72 underline underline-offset-4"
          >
            {reviews.sourceLabel}
          </a>
        </Reveal>
      </Band>
    </>
  );
}
