import { LinksEntry } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  entries: LinksEntry[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<LinksEntry>) => void;
  onRemove: (id: string) => void;
}

export default function LinksForm({ entries, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Add your LinkedIn, portfolio, GitHub, or any other relevant links.</p>
      {entries.map((link) => (
        <div key={link.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end animate-fade-in">
          <div className="space-y-1.5">
            <Label className="text-xs">Label</Label>
            <Input
              placeholder="e.g. LinkedIn"
              value={link.name}
              onChange={e => onUpdate(link.id, { name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">URL</Label>
            <Input
              placeholder="https://..."
              value={link.link}
              onChange={e => onUpdate(link.id, { link: e.target.value })}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
            onClick={() => onRemove(link.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="w-full gap-1.5 text-primary border-primary/30 hover:bg-accent hover:border-primary/60"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Link
      </Button>
    </div>
  );
}
