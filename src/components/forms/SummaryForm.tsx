import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface Props {
  data: string;
  onChange: (summary: string) => void;
}

export default function SummaryForm({ data, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      <RichTextEditor
        value={data}
        onChange={onChange}
        placeholder="Write a compelling summary of your professional background, key skills, and career goals. Highlight your unique value proposition and what you bring to potential employers."
        minRows={6}
      />
    </div>
  );
}
