import Document from '@tiptap/extension-document';
import FontFamily from '@tiptap/extension-font-family';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { Fragment, useState } from 'react';

// components

// extensions, utils, helpers
import { LiteralIndent } from './extensions';
import ImageNode from './extensions';

import MenuBar from './MenuBar';
import { title } from 'process';

type NoteEditorProps = {
    editable: boolean;
    onSave?: (note: { title: string; content: string }) => void;
};

const NoteEditor = ({ editable = false, onSave }: NoteEditorProps) => {
    const [noteContent, setNoteContent] = useState<string>('');
    const [noteTitle, setNoteTitle] = useState<string>('');

    const editor = useEditor({
        editable,
        // allow users to select whether they want literal tabs, just tabs in code blocks, or neither.
        // extensions: [StarterKit, TabbedCodeBlock, LiteralTab],
        extensions: [
            StarterKit,
            Document,
            Paragraph,
            Text,
            TextStyle,
            FontFamily,
            Typography,
            TextAlign.configure({
                types: [
                    'paragraph',
                    'heading',
                    'code_block',
                    'bullet_list',
                    'ordered_list',
                    'blockquote',
                ],
            }),
            // Custom extensions
            LiteralIndent,
            // ImageNode,
        ],
        editorProps: {
            // using @tailwindcss/typography, see tailwind.config.cjs for theming and overrides
            attributes: {
                // Allow users to select their theme (prose-slate)... maybe customise?
                class: 'max-w-none rounded-sm prose prose-slate prose-img:rounded-lg prose-a:text-blue-600 p-5 focus:outline-none',
            },
        },
        content: `
        <h2>
          Hi there,
        </h2>
        <image-node></image-node>
        <p>
          this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That’s a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
        </p>
    <pre><code class="language-css">body {
      display: none;
    }</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that’s amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `,
    });

    return (
        <Fragment>
            {editable && (
                <div className="w-full py-4">
                    {/* Title section */}
                    <div className="mb-8 border-b">
                        <h2 className="card-title">
                            <input
                                type="text"
                                placeholder="Note Title"
                                className="input-primary input input-lg w-full rounded-md font-bold"
                                value={noteTitle}
                                onChange={(e) =>
                                    setNoteTitle(e.currentTarget.value)
                                }
                            />
                        </h2>
                    </div>
                </div>
            )}

            <div className="border-1 rounded-md border-slate-100 bg-white p-6 shadow-md">
                {/* toolbar */}
                <div
                    id="menu-wrapper"
                    className="mx-2 mb-4 border-b border-t border-slate-300 pt-4"
                >
                    <MenuBar editor={editor} />
                </div>
                {/* Editor */}
                <EditorContent editor={editor} />
            </div>

            {onSave && (
                <div className="flex w-full py-4">
                    {/* Save / delete buttons */}
                    <button
                        type="button"
                        className="btn-primary btn mx-auto w-1/3 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => {
                            onSave({
                                title: noteTitle,
                                content: editor?.getHTML()
                                    ? editor.getHTML()
                                    : '',
                            });
                        }}
                        disabled={title.trim().length === 0}
                    >
                        Save
                    </button>
                </div>
            )}
        </Fragment>
    );
};

export default NoteEditor;
