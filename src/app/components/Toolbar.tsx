import { Editor } from "@tiptap/react";

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-200 rounded-t-xl bg-gray-50">
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={editor.isActive("bold") ? "bg-cyan-100 p-2 rounded" : "p-2"}
      >
        Bold
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={editor.isActive("italic") ? "bg-cyan-100 p-2 rounded" : "p-2"}
      >
        Italic
      </button>
    </div>
  );
}
