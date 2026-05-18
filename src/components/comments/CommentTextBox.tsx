'use client';

import { useSubmitComment, useGetUsers } from '@/hooks/commentHooks';
import useMentionSuggestion from '@/hooks/useMentionSuggestion';
import useResettableActionState from '@/hooks/useResettableActionState';
import { User } from '@/lib/types';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function getMentionLabel(u: Pick<User, 'username' | 'firstName' | 'lastName'>): string {
    if (u.firstName && u.lastName) return `${u.firstName} ${u.lastName[0]}.`;
    if (u.firstName) return u.firstName;
    return u.username ?? '';
}

export default function CommentTextBox({
    postId,
    user,
    postKey,
    closeReplyTextbox,
    openReplies,
    parentCommentId,
    replyTo,
}: {
    postId: string;
    user: User | undefined;
    postKey: string;
    closeReplyTextbox: () => void;
    openReplies: () => void;
    parentCommentId?: string;
    replyTo?: Pick<User, 'id' | 'username' | 'firstName' | 'lastName'>;
}) {
    const { submitComment } = useSubmitComment(postId);
    const [content, setContent] = useState('');
    const [isEmpty, setIsEmpty] = useState(true);
    const { data: users } = useGetUsers(!!user);
    const { extension: mentionExtension, dropdownState, selectMention } = useMentionSuggestion(users);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: user ? 'Write a comment!' : 'Log in to comment!',
                showOnlyWhenEditable: false,
            }),
            mentionExtension,
        ],
        editable: !!user,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            setIsEmpty(editor.isEmpty);
            setContent(JSON.stringify(editor.getJSON()));
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none',
            },
        },
    });

    useEffect(() => {
        if (!editor || !replyTo) return;
        const label = replyTo.username ?? [replyTo.firstName, replyTo.lastName].filter(Boolean).join(' ');
        editor.commands.setContent([
            { type: 'mention', attrs: { id: replyTo.id, label } },
            { type: 'text', text: ' ' },
        ]);
        editor.commands.focus('end');
    }, [editor, replyTo?.id]);

    const handleSubmit = async (_: unknown, formData: FormData) => {
        try {
            const { id: submittedCommentId } = await submitComment(formData);

            editor?.commands.clearContent();
            closeReplyTextbox();
            openReplies();

            setTimeout(() => {
                document
                    .getElementById(`comment-${submittedCommentId}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);

            fetch(`/api/posts/${postId}/comments/${submittedCommentId}/notify`, {
                method: 'POST',
                body: JSON.stringify({ parentCommentId }),
                keepalive: true,
            }).catch(console.error);
        } catch (error) {
            console.error(error);
            return 'Failed to submit comment';
        }
    };

    const [errorMessage, formAction, isPending, reset] = useResettableActionState(handleSubmit, null);

    return (
        <form className="w-full flex flex-col justify-start gap-4" action={formAction}>
            {parentCommentId && <input type="hidden" name="parent_comment_id" value={parentCommentId} />}
            <input type="hidden" name="content" value={content} />
            <div>
                <div
                    className={`textarea w-full mb-4 !min-h-[4rem] cursor-text ${!user ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => editor?.commands.focus()}
                >
                    <EditorContent editor={editor} />
                </div>
                {dropdownState && dropdownState.items.length > 0 && (
                    <div
                        style={{
                            position: 'fixed',
                            top: dropdownState.pos.top + 4,
                            left: dropdownState.pos.left,
                            zIndex: 50,
                        }}
                        className="bg-base-100 border border-base-300 rounded-box shadow-lg overflow-hidden"
                    >
                        {dropdownState.items.map((u, i) => (
                            <button
                                key={u.id}
                                type="button"
                                className={`w-full text-left px-3 py-1.5 text-sm ${
                                    i === dropdownState.selectedIdx
                                        ? 'bg-primary text-primary-content'
                                        : 'hover:bg-base-200'
                                }`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectMention(u);
                                }}
                            >
                                {getMentionLabel(u)}
                            </button>
                        ))}
                    </div>
                )}
                <div className={`${errorMessage ? 'flex justify-between items-center' : ''} mb-4`}>
                    {errorMessage && <span className="text-sm text-error">{errorMessage}</span>}
                    {user ? (
                        <div className="flex justify-end gap-2">
                            {(!isEmpty || parentCommentId) && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => {
                                        editor?.commands.clearContent();
                                        reset();
                                        if (closeReplyTextbox) closeReplyTextbox();
                                    }}
                                    disabled={isPending}
                                >
                                    Cancel
                                </button>
                            )}
                            <button type="submit" className="btn btn-sm btn-primary" disabled={isEmpty || isPending}>
                                {!isPending ? 'Comment' : 'Commenting...'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-end gap-2">
                            <Link href={`/login?redirectUrl=/posts/${postKey}`}>
                                <button type="button" className="btn btn-primary">
                                    Log in
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
