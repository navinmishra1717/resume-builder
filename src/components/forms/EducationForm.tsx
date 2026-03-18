import { EducationEntry } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  entries: EducationEntry[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<EducationEntry>) => void;
  onRemove: (id: string) => void;
}

export default function EducationForm({ entries, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="space-y-4">
      {entries.map((edu, idx) => (
        <div key={edu.id} className="p-4 border border-border rounded-md bg-background space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Entry {idx + 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onRemove(edu.id)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Degree / Qualification</Label>
              <Input placeholder="B.Sc. Computer Science" value={edu.degree} onChange={e => onUpdate(edu.id, { degree: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Institution</Label>
              <Input placeholder="MIT" value={edu.institution} onChange={e => onUpdate(edu.id, { institution: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input placeholder="Cambridge, MA" value={edu.location} onChange={e => onUpdate(edu.id, { location: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Start Year</Label>
              <Input placeholder="2018" value={edu.startYear} onChange={e => onUpdate(edu.id, { startYear: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>End Year</Label>
              <Input placeholder="2022" value={edu.endYear} onChange={e => onUpdate(edu.id, { endYear: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>GPA (optional)</Label>
              <Input placeholder="3.8/4.0" value={edu.gpa} onChange={e => onUpdate(edu.id, { gpa: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Additional Notes</Label>
            <Textarea placeholder="Relevant coursework, honors, activities..." value={edu.description} onChange={e => onUpdate(edu.id, { description: e.target.value })} rows={2} className="resize-none" />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd} className="w-full gap-1.5 text-primary border-primary/30 hover:bg-accent hover:border-primary/60">
        <Plus className="w-3.5 h-3.5" />
        Add Education
      </Button>
    </div>
  );
}
