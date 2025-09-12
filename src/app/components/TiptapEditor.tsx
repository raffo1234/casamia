"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import Toolbar from "./Toolbar"; // Import the toolbar
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

interface TiptapEditorProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
}

export default function TiptapEditor<T extends FieldValues>({ field }: TiptapEditorProps<T>) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: field.value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none p-4",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(editor.getHTML());
    },
    onBlur: () => {
      field.onBlur();
    },
  });

  useEffect(() => {
    if (editor && field.value !== editor.getHTML()) {
      editor.commands.setContent(field.value);
    }
  }, [editor, field.value]);

  return (
    <div className="border border-gray-200 rounded-xl focus-within:ring-4 focus-within:ring-cyan-100 focus-within:border-cyan-500 w-full">
      <Toolbar editor={editor} />
      <div className="prose">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
