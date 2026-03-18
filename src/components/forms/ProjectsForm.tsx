import { ProjectEntry } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  entries: ProjectEntry[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<ProjectEntry>) => void;
  onRemove: (id: string) => void;
}

export default function ProjectsForm({ entries, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="space-y-4">
      {entries.map((proj, idx) => (
        <div key={proj.id} className="p-4 border border-border rounded-md bg-background space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Project {idx + 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onRemove(proj.id)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Project Title</Label>
              <Input placeholder="My Awesome App" value={proj.title} onChange={e => onUpdate(proj.id, { title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Link (optional)</Label>
              <Input placeholder="https://github.com/..." value={proj.link} onChange={e => onUpdate(proj.id, { link: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Technologies Used</Label>
            <Input placeholder="React, Node.js, PostgreSQL" value={proj.technologies} onChange={e => onUpdate(proj.id, { technologies: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              placeholder="What the project does and your impact..."
              value={proj.description}
              onChange={e => onUpdate(proj.id, { description: e.target.value })}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd} className="w-full gap-1.5 text-primary border-primary/30 hover:bg-accent hover:border-primary/60">
        <Plus className="w-3.5 h-3.5" />
        Add Project
      </Button>
    </div>
  );
}
