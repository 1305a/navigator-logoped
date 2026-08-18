import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IntakeFullCardItem, IntakeFullCardSection } from "@/data/intake";

function ItemLine({ item }: { item: IntakeFullCardItem }) {
  return (
    <li className="flex items-start gap-2 text-[13px] text-foreground/90">
      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
      <span>
        {item.text} <span className="italic text-violet-500">[{item.format}]</span>
      </span>
    </li>
  );
}

export function IntakeFullCard({
  cardName,
  sections,
}: {
  cardName: string;
  sections: IntakeFullCardSection[];
}) {
  const [openSet, setOpenSet] = useState<Set<string>>(() => new Set([sections[0]?.title]));
  const totalItems = sections.reduce(
    (sum, s) => sum + (s.items ? s.items.length : (s.groups ?? []).reduce((a, g) => a + g.items.length, 0)),
    0,
  );

  function toggle(title: string) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs text-muted-foreground">
        Полный протокол «{cardName}» — {sections.length} разделов, {totalItems} проб
      </p>
      {sections.map((sec) => {
        const count = sec.items ? sec.items.length : (sec.groups ?? []).reduce((a, g) => a + g.items.length, 0);
        const open = openSet.has(sec.title);
        return (
          <div key={sec.title} className="overflow-hidden rounded-lg border">
            <button
              type="button"
              onClick={() => toggle(sec.title)}
              className="flex w-full items-center justify-between gap-3 bg-muted/40 px-3.5 py-2.5 text-left text-[13.5px] font-semibold text-foreground hover:bg-muted/70"
            >
              <span>{sec.title}</span>
              <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-muted-foreground">
                {count}
                {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
              </span>
            </button>
            {open && (
              <div className={cn("flex flex-col gap-3 px-4 py-3.5", sec.note && "pt-0")}>
                {sec.note && <p className="pt-3 text-xs italic text-muted-foreground">{sec.note}</p>}
                {sec.items && <ul className="flex flex-col gap-2">{sec.items.map((it) => <ItemLine key={it.text} item={it} />)}</ul>}
                {sec.groups?.map((g) => (
                  <div key={g.sub} className="flex flex-col gap-2">
                    <p className="text-[12.5px] font-semibold text-foreground/90">{g.sub}</p>
                    <ul className="flex flex-col gap-2">
                      {g.items.map((it) => (
                        <ItemLine key={it.text} item={it} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
