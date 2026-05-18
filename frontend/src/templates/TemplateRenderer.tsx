import type { TemplateProps } from './types';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import CreativeTemplate from './CreativeTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import MinimalTemplate from './MinimalTemplate';

interface RendererProps extends TemplateProps {
  templateId: string;
}

export default function TemplateRenderer({ templateId, ...props }: RendererProps) {
  switch (templateId) {
    case 'modern': return <ModernTemplate {...props} />;
    case 'classic': return <ClassicTemplate {...props} />;
    case 'creative': return <CreativeTemplate {...props} />;
    case 'executive': return <ExecutiveTemplate {...props} />;
    case 'minimal': return <MinimalTemplate {...props} />;
    default: return <ModernTemplate {...props} />;
  }
}
