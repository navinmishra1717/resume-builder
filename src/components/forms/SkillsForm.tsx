import { SkillCategory } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EXPERTISE_LEVELS = ['Beginner', 'Skillful', 'Experienced', 'Expert'];

interface Props {
  entries: SkillCategory[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<SkillCategory>) => void;
  onRemove: (id: string) => void;
}

export default function SkillsForm({ entries, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Add skills with their expertise level. These will be displayed in a two-column grid.</p>
      {entries.map((item) => (
        <div key={item.id} className="flex gap-3 items-end animate-fade-in">
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Skill</Label>
              <Input
                placeholder="e.g. JavaScript"
                value={item.skill}
                onChange={e => onUpdate(item.id, { skill: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Expertise Level</Label>
              <Select
                value={item.expertiseLevel || ''}
                onValueChange={val => onUpdate(item.id, { expertiseLevel: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERTISE_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
            onClick={() => onRemove(item.id)}
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
        Add Skill
      </Button>
    </div>
  );
}
