import { CertificationEntry } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  entries: CertificationEntry[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<CertificationEntry>) => void;
  onRemove: (id: string) => void;
}

export default function CertificationsForm({ entries, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="space-y-3">
      {entries.map((cert, idx) => (
        <div key={cert.id} className="p-4 border border-border rounded-md bg-background animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Certification {idx + 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onRemove(cert.id)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Certificate Name</Label>
              <Input placeholder="AWS Solutions Architect" value={cert.name} onChange={e => onUpdate(cert.id, { name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Issuing Organization</Label>
              <Input placeholder="Amazon Web Services" value={cert.issuer} onChange={e => onUpdate(cert.id, { issuer: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="space-y-1.5">
              <Label>Date Issued</Label>
              <Input placeholder="March 2023" value={cert.date} onChange={e => onUpdate(cert.id, { date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Credential URL (optional)</Label>
              <Input placeholder="https://..." value={cert.link} onChange={e => onUpdate(cert.id, { link: e.target.value })} />
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd} className="w-full gap-1.5 text-primary border-primary/30 hover:bg-accent hover:border-primary/60">
        <Plus className="w-3.5 h-3.5" />
        Add Certification
      </Button>
    </div>
  );
}
