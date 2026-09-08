import { FieldLab, type Sheet } from "@/components/FieldLab";
import { Band, SectionHead, MediaTile, Button } from "@/components/ui";

/**
 * Sandbox stage. The same three screenfuls of real content over whichever
 * candidate field is being judged, so the comparison is about the
 * background and nothing else.
 *
 * The shipped `AmbientField` is the first `.field` under `<body>`; this
 * hides it so two fields never stack. Sandbox only — see `presets.ts`.
 */
export function Stage({
  sheets,
  label,
  bare = false,
}: {
  sheets: Sheet[] | null;
  label: string;
  /** The page supplies its own field (a shader, say) — render content only. */
  bare?: boolean;
}) {
  return (
    <>
      {sheets && (
        <style>{`body > .field:first-of-type { display: none !important; }`}</style>
      )}
      {sheets && <FieldLab sheets={sheets} />}
      {bare && <div aria-hidden className="grain" />}

      <div className="fixed left-4 top-24 z-50 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-[13px] font-semibold text-white">
        {label}
      </div>

      <Band>
        <SectionHead
          title="Работаем с физиологией, а не с кнопкой «Старт»"
          lead="То, что сработало на прошлом клиенте, может не подойти вам. Мы исключили конвейерные настройки."
        />
        <div className="mt-12 flex justify-center">
          <Button href="#">Записаться онлайн</Button>
        </div>
      </Band>

      <Band>
        <SectionHead title="Наш ViART" size="h2" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <MediaTile
            src="/photos/room-mirror.webp"
            alt="Кабинет с подсвеченными арками"
            title="Кабинет"
            body="Подсветка по контуру зеркал, а не потолочный свет в лицо."
          />
          <MediaTile
            src="/photos/interior-flowers.webp"
            alt="Интерьер студии"
            title="Зона ожидания"
            body="Сухоцветы, вода, тишина. Ждать здесь не обязательно, но можно."
          />
          <MediaTile
            src="/photos/lounge-guest.webp"
            alt="Гостья студии"
            title="После процедуры"
            body="Час, в котором время принадлежит только вам."
          />
        </div>
      </Band>

      <Band>
        <SectionHead
          title="Мелкий текст на этом фоне"
          size="h2"
          lead="Этот абзац здесь ради контраста: он набран тем же кеглем, что подписи под ценами и даты под отзывами, и именно он первым ломается, если фон слишком светлый или слишком пёстрый. Если читать его в углу экрана труднее, чем в центре, фон не годится."
        />
      </Band>
    </>
  );
}
