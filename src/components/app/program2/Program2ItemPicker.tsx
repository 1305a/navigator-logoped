import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function Program2ItemPicker({
  open,
  onOpenChange,
  title,
  description,
  emptyMessage,
  placeholder,
  options,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  emptyMessage: string;
  placeholder: string;
  options: { id: string; label: string }[];
  onPick: (id: string) => void;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <Select value={value} onValueChange={(v) => v && setValue(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder}>
                {(v: string | null) => options.find((o) => o.id === v)?.label ?? placeholder}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DialogFooter>
          <Button
            disabled={!value}
            className="gap-1.5"
            onClick={() => {
              onPick(value);
              onOpenChange(false);
            }}
          >
            <Plus className="size-4" /> Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
