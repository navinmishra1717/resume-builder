import { HobbyEntry } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  entries: HobbyEntry[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<HobbyEntry>) => void;
  onRemove: (id: string) => void;
}

export default function HobbiesForm({ entries, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">List your hobbies or interests (e.g., "Photography, Hiking, Open Source").</p>
      {entries.map((hobby) => (
        <div key={hobby.id} className="flex gap-2 items-center animate-fade-in">
          <Input
            placeholder="e.g. Photography"
            value={hobby.description}
            onChange={e => onUpdate(hobby.id, { description: e.target.value })}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive shrink-0" onClick={() => onRemove(hobby.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd} className="w-full gap-1.5 text-primary border-primary/30 hover:bg-accent hover:border-primary/60">
        <Plus className="w-3.5 h-3.5" />
        Add Interest
      </Button>
    </div>
  );
}
