import { PersonalInfo } from '@/types/resume';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface Props {
  data: PersonalInfo;
  onChange: (updates: Partial<PersonalInfo>) => void;
}

export default function PersonalInfoForm({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" placeholder="Jane Smith" value={data.name} onChange={e => onChange({ name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" placeholder="jane@example.com" value={data.email} onChange={e => onChange({ email: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="+1 (555) 000-0000" value={data.phone} onChange={e => onChange({ phone: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="San Francisco, CA" value={data.location} onChange={e => onChange({ location: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" placeholder="linkedin.com/in/janesmith" value={data.linkedin} onChange={e => onChange({ linkedin: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website">Website / Portfolio</Label>
          <Input id="website" placeholder="janesmith.dev" value={data.website} onChange={e => onChange({ website: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="summary">Professional Summary</Label>
        <RichTextEditor
          value={data.summary}
          onChange={val => onChange({ summary: val })}
          placeholder="A brief overview of your experience and goals..."
          minRows={3}
        />
      </div>
    </div>
  );
}
