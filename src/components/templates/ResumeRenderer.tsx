import { ResumeData, TemplateId } from '@/types/resume';
import MinimalTemplate from './MinimalTemplate';
import ModernTemplate from './ModernTemplate';
import CreativeTemplate from './CreativeTemplate';
import ClassicTemplate from './ClassicTemplate';

interface Props {
  data: ResumeData;
  templateId?: TemplateId;
}

export default function ResumeRenderer({ data, templateId }: Props) {
  const id = templateId ?? data.selectedTemplate;
  switch (id) {
    case 'modern': return <ModernTemplate data={data} />;
    case 'creative': return <CreativeTemplate data={data} />;
    case 'classic': return <ClassicTemplate data={data} />;
    default: return <MinimalTemplate data={data} />;
  }
}
