import type { WorkSection } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface SectionAssignmentEditorProps {
  sectionIds: string[];
  allSections: WorkSection[];
  onAdd: (sectionId: string) => void;
  onRemove: (sectionId: string) => void;
}

export function SectionAssignmentEditor({
  sectionIds,
  allSections,
  onAdd,
  onRemove,
}: SectionAssignmentEditorProps) {
  const assigned = sectionIds
    .map((id) => allSections.find((s) => s.id === id))
    .filter((s): s is WorkSection => !!s);
  const available = allSections.filter((s) => !sectionIds.includes(s.id));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {assigned.map((s) => (
        <Badge key={s.id} variant="secondary" className="gap-1 pr-1">
          {s.title}
          <button
            type="button"
            onClick={() => onRemove(s.id)}
            aria-label={`Убрать раздел «${s.title}»`}
            className="rounded-full p-0.5 text-muted-foreground hover:bg-background/60 hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      {available.length > 0 && (
        <Select onValueChange={(v: string | null) => v && onAdd(v)}>
          <SelectTrigger
            size="sm"
            className="h-5 gap-1 rounded-4xl border-dashed px-2 text-xs text-muted-foreground"
          >
            <Plus className="size-3" /> Раздел
          </SelectTrigger>
          <SelectContent>
            {available.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
