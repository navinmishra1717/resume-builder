import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minRows?: number;
}

function ToolbarButton({ onClick, active, title, children }: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={cn(
        'p-1 rounded hover:bg-muted transition-colors',
        active ? 'bg-accent text-primary' : 'text-muted-foreground'
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder, className, minRows = 4 }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? 'Start typing…' }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[inherit] prose prose-sm max-w-none text-foreground leading-relaxed',
      },
    },
  });

  // Sync external value changes (e.g. reset)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className={cn('border border-input rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered list"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>
      {/* Editor */}
      <EditorContent
        editor={editor}
        className="px-3 py-2 text-sm"
        style={{ minHeight: `${minRows * 1.6}rem` }}
      />
    </div>
  );
}
