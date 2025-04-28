'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { submitPost } from '@/lib/actions';
import Markdown from 'react-markdown';
const markDownRegex =
    /(!\[.*?\]\(.*?\))|(\[.*?\]\(.*?\))|(`{3}.*?\n[\s\S]*?\n`{3})|(`[^`]+`)|(\*\*.*?\*\*)|(__.*?__)|(\*.*?\*)|(_.*?_)|(~~.*?~~)|(^>.*?$)|(^#+\s?.*$)|(-\s)|(\*\s)|(\d+\.\s)|(---)|(\*\*\*+)|(\\.)/gm;

// Editor page
export default function Editor() {
    const [text, setText] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [isMissionaryPost, setIsMissionaryPost] = useState<boolean>(false);
    const [postId, setPostId] = useState<string | undefined>(undefined);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    console.log(isMissionaryPost);
    const handleSubmit = async (_: any, formData: FormData) => {
        (document.getElementById('submit_modal') as any).showModal();
        formData.append('content', text);
        formData.append('raw_text', title + text.replace(markDownRegex, ''));
        formData.append('title', title);
        const postKey = title.replace(/\s+/g, '-').toLowerCase().slice(0, 50);
        formData.append('post_key', postKey);
        formData.append('content_type', 'markdown');
        formData.append('mission_post', isMissionaryPost.toString());
        formData.append('id', postId ? postId.toString() : '');
        const post = await submitPost(formData);
        setPostId(post?.id);
        setIsSubmitted(true);
    };

    const [state, formAction, isPending] = useActionState(handleSubmit, undefined);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const savedText = localStorage.getItem('postContent');
        if (savedText) {
            setText(savedText);
        }

        const savedTitle = localStorage.getItem('postTitle');
        if (savedTitle) {
            setTitle(savedTitle);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('postContent', text);
    }, [text]);

    useEffect(() => {
        localStorage.setItem('postTitle', title);
    }, [title]);

    const handleKeyDown = (event: any) => {
        if (event.ctrlKey) {
            let markdown;
            let start = event.target.selectionStart;
            let end = event.target.selectionEnd;
            const subString = text.substring(start, end); // Substring will be '' if no selection

            switch (event.key) {
                case 'b': // Ctrl + B for bold
                    event.preventDefault();
                    markdown = `**${subString}**`;
                    break;
                case 'i': // Ctrl + I for italics
                    event.preventDefault();
                    markdown = `*${subString}*`;
                    break;
                case 's': // Ctrl + S for strikethrough
                    event.preventDefault();
                    markdown = `~~${subString}~~`;
                    break;
                case 'u': // Ctrl + U for underline
                    event.preventDefault();
                    markdown = `_${subString}_`;
                    break;
                case 'k': // Ctrl + K for link
                    event.preventDefault();
                    markdown = `[${subString}](url)`;
                    break;
                default:
                    return;
            }

            setText(text.slice(0, start) + markdown + text.slice(end));

            setTimeout(() => {
                if (textAreaRef.current) {
                    let cursorPosition;

                    if (event.key === 'k') {
                        // Place the cursor inside the link's URL ([](|))
                        cursorPosition = start + markdown.indexOf('(') + 1; // Inside the parentheses
                    }
                    if (subString) {
                        cursorPosition = start + markdown.length;
                    } else {
                        // When no text is selected
                        switch (event.key) {
                            case 'u':
                            case 'i':
                                cursorPosition = start + 1; // After the opening markdown (e.g., **)
                                break;
                            case 'b':
                            case 's':
                                // Place the cursor inside the markdown (**|**)
                                cursorPosition = start + 2; // After the opening markdown (e.g., **)
                                break;
                            default:
                                return;
                        }
                    }
                    textAreaRef.current.selectionStart = cursorPosition;
                    textAreaRef.current.selectionEnd = cursorPosition;
                }
            });
        }
    };

    return (
        <form className="flex flex-col max-w-screen-md mx-auto h-full justify-between" action={formAction}>
            {/* Use grid for the tablist as per DaisyUI's implementation */}
            <div
                role="tablist"
                className="tabs tabs-border tabs-lg pb-4 w-full h-full grow grid-rows-[auto,1fr]" // Use grid classes
            >
                <input
                    type="radio"
                    name="editor_tabs"
                    role="tab"
                    className="tab mb-4"
                    aria-label="Raw"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                    }}
                    defaultChecked
                />
                <div role="tabpanel" className="tab-content h-full overflow-hidden p-1">
                    <div className="flex flex-col gap-4 h-full">
                        <input
                            className="input w-full"
                            placeholder="Title"
                            autoComplete="off"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            title="content"
                            className="textarea text-base leading-snug border-base-300 p-6 w-full h-full"
                            ref={textAreaRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                <input type="radio" name="editor_tabs" role="tab" className="tab mb-4" aria-label="Preview" />
                <div className="tab-content border-base-300 rounded-box p-6" role="tabpanel">
                    <div className="prose overflow-y-auto">
                        <h1>{title}</h1>
                        <Markdown children={text} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-start gap-4">
                <div className="flex flex-row justify-center items-start gap-2">
                    <input
                        name="missionaryPost"
                        type="checkbox"
                        className="checkbox"
                        onChange={(e) => setIsMissionaryPost(e.target.checked)}
                    />
                    This is a missionary post
                </div>
                <button type="submit" className="btn self-start" disabled={isPending || isSubmitted}>
                    Submit
                </button>
            </div>
            <dialog id="submit_modal" className="modal">
                <div className="modal-box h-[200px] overflow-hidden">
                    {isPending ? (
                        <div className="flex flex-col justify-center items-center h-full">
                            <span className="loading self-center loading-lg" />
                        </div>
                    ) : (
                        <>
                            <h3 className="font-bold text-lg">Post submitted</h3>
                            <p className="py-4">Thank you Lord!</p>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => (document.getElementById('submit_modal') as any).close()}
                                >
                                    Close
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </dialog>
        </form>
    );
}
