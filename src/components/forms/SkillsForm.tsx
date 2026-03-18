import { SkillCategory } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  entries: SkillCategory[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<SkillCategory>) => void;
  onRemove: (id: string) => void;
}

export default function SkillsForm({ entries, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Group your skills by category. Separate skills with commas.</p>
      {entries.map((skill, idx) => (
        <div key={skill.id} className="flex gap-3 items-start animate-fade-in">
          <div className="flex-1 grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Input placeholder="Languages" value={skill.category} onChange={e => onUpdate(skill.id, { category: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Skills (comma-separated)</Label>
              <Input placeholder="JavaScript, TypeScript, Python" value={skill.skills} onChange={e => onUpdate(skill.id, { skills: e.target.value })} />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive mt-6 shrink-0" onClick={() => onRemove(skill.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd} className="w-full gap-1.5 text-primary border-primary/30 hover:bg-accent hover:border-primary/60">
        <Plus className="w-3.5 h-3.5" />
        Add Skill Group
      </Button>
    </div>
  );
}
