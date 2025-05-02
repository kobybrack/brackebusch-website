'use client';

import useResettableActionState from '@/hooks/useResettableActionState';
import { submitPost } from '@/lib/actions';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

export default function PostEditor() {
    const [text, setText] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [isMissionaryPost, setIsMissionaryPost] = useState<boolean>(false);
    const [postId, setPostId] = useState<string | undefined>(undefined);
    const submitModalRef = useRef<HTMLDialogElement | null>(null);

    const handleSubmit = async (_: any, formData: FormData) => {
        reset();
        submitModalRef.current?.showModal();
        const postOrError = await submitPost(formData);
        if (postOrError && typeof postOrError !== 'string' && postOrError.id) {
            setPostId(postOrError.id);
        } else if (typeof postOrError === 'string') {
            return postOrError;
        } else {
            return null;
        }
    };

    const [errorMessage, formAction, isPending, reset] = useResettableActionState(handleSubmit, null);
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.ctrlKey) {
            let markdown;
            const target = event.target as HTMLTextAreaElement;
            let start = target.selectionStart;
            let end = target.selectionEnd;
            const subString = text.substring(start, end);

            let markdownLength = 0;

            switch (event.key) {
                case 'b': // Ctrl + B for bold
                    event.preventDefault();
                    markdown = `**${subString}**`;
                    markdownLength = 4; // Length of "**" + "**"
                    break;
                case 'i': // Ctrl + I for italics
                    event.preventDefault();
                    markdown = `*${subString}*`;
                    markdownLength = 2; // Length of "*" + "*"
                    break;
                case 's': // Ctrl + S for strikethrough
                    event.preventDefault();
                    markdown = `~~${subString}~~`;
                    markdownLength = 4; // Length of "~~" + "~~"
                    break;
                case 'u': // Ctrl + U for underline (Markdown does not have native underline, this might render as italics if not styled)
                    event.preventDefault();
                    markdown = `_${subString}_`; // Using underscore which often renders as italics
                    markdownLength = 2; // Length of "_" + "_"
                    break;
                case 'k': // Ctrl + K for link
                    event.preventDefault();
                    markdown = `[${subString}](url)`;
                    // Cursor should go inside the 'url' part
                    markdownLength = `[${subString}]()`.length; // Length up to the opening parenthesis
                    break;
                default:
                    return; // Don't modify text or cursor if no match
            }

            const newText = text.slice(0, start) + markdown + text.slice(end);
            setText(newText);
            setTimeout(() => {
                if (textAreaRef.current) {
                    let cursorPosition;

                    if (event.key === 'k') {
                        // Place cursor inside the parentheses for the URL
                        cursorPosition = start + `[${subString}](`.length;
                    } else if (subString) {
                        // If text was selected, place cursor at the end of the inserted markdown
                        cursorPosition = start + markdown.length;
                    } else {
                        // If no text was selected, place cursor inside the markdown
                        cursorPosition = start + markdownLength / 2; // Place in the middle of the markdown tags
                    }

                    textAreaRef.current.selectionStart = cursorPosition;
                    textAreaRef.current.selectionEnd = cursorPosition;
                }
            }, 0);
        }
    };

    return (
        <form className="flex flex-col max-w-screen-md mx-auto h-full" action={formAction}>
            <div role="tablist" className="tabs tabs-border tabs-lg pb-4 flex flex-row grow">
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
                            name="title"
                            className="input w-full"
                            placeholder="Title"
                            autoComplete="off"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            name="content"
                            title="content"
                            className="textarea text-base leading-snug border-base-300 p-6 w-full"
                            ref={textAreaRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                <input type="radio" name="editor_tabs" role="tab" className="tab mb-4" aria-label="Preview" />
                <div className="tab-content" role="tabpanel">
                    <div className="border border-base-300 rounded-box p-6 prose w-full">
                        <h1>{title}</h1>
                        <Markdown children={text || ''} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-start gap-4">
                <div className="flex flex-row justify-center items-start gap-2">
                    <input
                        name="mission_post"
                        type="checkbox"
                        className="checkbox"
                        checked={isMissionaryPost}
                        onChange={(e) => setIsMissionaryPost(e.target.checked)}
                    />
                    This is a missionary post
                </div>
                <button type="submit" className="btn self-start" disabled={isPending}>
                    {isPending ? 'Submitting...' : 'Submit'}
                </button>
            </div>
            <dialog id="submit_modal" className="modal" ref={submitModalRef}>
                <div className="modal-box h-[200px] overflow-hidden">
                    {isPending ? (
                        <div className="flex flex-col justify-center items-center h-full">
                            <span className="loading self-center loading-lg" />
                        </div>
                    ) : (
                        <>
                            <h3 className="font-bold text-lg">{`Post ${errorMessage ? 'not ' : ''}submitted`}</h3>
                            <p className={`py-4 ${errorMessage ? 'text-error' : ''}`}>
                                {!errorMessage ? 'Thank you Lord!' : errorMessage}
                            </p>
                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => submitModalRef.current?.close()}>
                                    Close
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </dialog>

            <input type="hidden" name="id" value={postId} />
            <input type="hidden" name="content_type" value={'markdown'} />
        </form>
    );
}
