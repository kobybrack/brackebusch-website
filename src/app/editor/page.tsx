'use client';

import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

// About page
export default function Page() {
    const [text, setText] = useState<string>(() => {
        const savedText = localStorage.getItem('markdownContent');
        return savedText || '';
    });
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        localStorage.setItem('markdownContent', text);
    }, [text]);

    // TODO: add spoiler? add anything else?
    const handleKeyDown = (event: any) => {
        if (event.ctrlKey) {
            let markdown;
            let start = event.target.selectionStart;
            let end = event.target.selectionEnd;
            switch (event.key) {
                case 'b': // Ctrl + B for bold
                    event.preventDefault();
                    markdown = `**${text.substring(start, end)}**`;
                    break;
                case 'i': // Ctrl + I for italics
                    event.preventDefault();
                    markdown = `*${text.substring(start, end)}*`;
                    break;
                case 's': // TODO: make work Ctrl + S for strikethrough
                    event.preventDefault();
                    markdown = `~~${text.substring(start, end)}~~`;
                    break;
                case 'u': // TODO: make work Ctrl + U for underline
                    event.preventDefault();
                    markdown = `_${text.substring(start, end)}_`;
                    break;
                case 'k': // Ctrl + K for link
                    event.preventDefault();
                    markdown = `[${text.substring(start, end)}](url)`;
                    break;
                default:
                    return;
            }
            setText(text.slice(0, start) + markdown + text.slice(end));
            setTimeout(() => {
                if (textAreaRef.current) {
                    textAreaRef.current.selectionStart = start + markdown.length;
                    textAreaRef.current.selectionEnd = start + markdown.length;
                }
            });
        }
    };

    const handleChange = (event: any) => {
        setText(event.target.value);
    };

    return (
        <form className="form">
            <div className="flex justify-center items-start max-w-screen-md mx-auto h-full">
                <div role="tablist" className="tabs tabs-lifted w-full">
                    <input type="radio" name="editor_tabs" role="tab" className="tab" aria-label="Raw" defaultChecked />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-0">
                        {/* p-6 */}
                        <textarea
                            title="Raw text"
                            className="textarea p-6 w-full h-[500px]"
                            style={{ resize: 'none', fontSize: '1rem', lineHeight: '1.75', border: 'none' }}
                            ref={textAreaRef}
                            value={text}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        ></textarea>
                    </div>

                    <input type="radio" name="editor_tabs" role="tab" className="tab" aria-label="Preview" />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                        <div className="prose">
                            <Markdown children={text} />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
