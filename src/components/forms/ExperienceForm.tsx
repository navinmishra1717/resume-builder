import { ExperienceEntry } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  entries: ExperienceEntry[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<ExperienceEntry>) => void;
  onRemove: (id: string) => void;
}

export default function ExperienceForm({ entries, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="space-y-4">
      {entries.map((exp, idx) => (
        <div key={exp.id} className="p-4 border border-border rounded-md bg-background space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Entry {idx + 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onRemove(exp.id)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Job Title</Label>
              <Input placeholder="Software Engineer" value={exp.role} onChange={e => onUpdate(exp.id, { role: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input placeholder="Acme Corp" value={exp.company} onChange={e => onUpdate(exp.id, { company: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input placeholder="Remote" value={exp.location} onChange={e => onUpdate(exp.id, { location: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Input placeholder="Jan 2021" value={exp.startDate} onChange={e => onUpdate(exp.id, { startDate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>End Date</Label>
              <Input placeholder="Dec 2023" value={exp.endDate} disabled={exp.current} onChange={e => onUpdate(exp.id, { endDate: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id={`current-${exp.id}`} checked={exp.current} onCheckedChange={checked => onUpdate(exp.id, { current: !!checked, endDate: checked ? '' : exp.endDate })} />
            <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal cursor-pointer">I currently work here</Label>
          </div>
          <div className="space-y-1.5">
            <Label>Description & Achievements</Label>
            <Textarea
              placeholder="• Led development of core payment API processing $2M/month&#10;• Mentored 3 junior engineers&#10;• Reduced load time by 40%"
              value={exp.description}
              onChange={e => onUpdate(exp.id, { description: e.target.value })}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd} className="w-full gap-1.5 text-primary border-primary/30 hover:bg-accent hover:border-primary/60">
        <Plus className="w-3.5 h-3.5" />
        Add Experience
      </Button>
    </div>
  );
}
