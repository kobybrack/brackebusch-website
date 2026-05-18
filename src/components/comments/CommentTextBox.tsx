'use client';

import { useSubmitComment, useGetUsers } from '@/hooks/commentHooks';
import useResettableActionState from '@/hooks/useResettableActionState';
import { User } from '@/lib/types';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';

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
    const usersRef = useRef(users);
    usersRef.current = users;

    const [mentionState, setMentionState] = useState<{
        items: User[];
        pos: { top: number; left: number };
        selectedIdx: number;
    } | null>(null);
    const mentionCommandRef = useRef<((attrs: { id: string; label: string }) => void) | null>(null);
    const mentionSelectedIdxRef = useRef(0);
    const mentionItemsRef = useRef<User[]>([]);
    const clientRectRef = useRef<(() => DOMRect | null | undefined) | null>(null);

    const isMentionOpen = mentionState !== null;
    useEffect(() => {
        if (!isMentionOpen) return;
        const handleScroll = () => {
            const rect = clientRectRef.current?.();
            if (rect) {
                setMentionState((prev) => (prev ? { ...prev, pos: { top: rect.bottom, left: rect.left } } : null));
            }
        };
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [isMentionOpen]);

    const selectMention = useCallback((u: User) => {
        const label = u.username ?? [u.firstName, u.lastName].filter(Boolean).join(' ');
        mentionCommandRef.current?.({ id: u.id, label });
        setMentionState(null);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: user ? 'Write a comment!' : 'Log in to comment!',
                showOnlyWhenEditable: false,
            }),
            Mention.configure({
                HTMLAttributes: { class: 'font-bold' },
                suggestion: {
                    char: '@',
                    items: ({ query }) => {
                        if (query.length < 2 || !usersRef.current) return [];
                        const q = query.toLowerCase();
                        return usersRef.current
                            .filter(
                                (u) =>
                                    u.username?.toLowerCase().includes(q) ||
                                    `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase().trim().includes(q),
                            )
                            .slice(0, 8);
                    },
                    render: () => ({
                        onStart({ items, command, clientRect }) {
                            mentionItemsRef.current = items as User[];
                            mentionSelectedIdxRef.current = 0;
                            mentionCommandRef.current = command;
                            clientRectRef.current = clientRect ?? null;
                            const rect = clientRect?.();
                            if (rect && items.length > 0) {
                                setMentionState({
                                    items: items as User[],
                                    pos: { top: rect.bottom, left: rect.left },
                                    selectedIdx: 0,
                                });
                            }
                        },
                        onUpdate({ items, command, clientRect }) {
                            mentionItemsRef.current = items as User[];
                            mentionSelectedIdxRef.current = 0;
                            mentionCommandRef.current = command;
                            clientRectRef.current = clientRect ?? null;
                            const rect = clientRect?.();
                            if (rect && items.length > 0) {
                                setMentionState({
                                    items: items as User[],
                                    pos: { top: rect.bottom, left: rect.left },
                                    selectedIdx: 0,
                                });
                            } else {
                                setMentionState(null);
                            }
                        },
                        onKeyDown({ event }) {
                            if (!mentionItemsRef.current.length) return false;
                            if (event.key === 'ArrowDown') {
                                const next = Math.min(
                                    mentionSelectedIdxRef.current + 1,
                                    mentionItemsRef.current.length - 1,
                                );
                                mentionSelectedIdxRef.current = next;
                                setMentionState((prev) => (prev ? { ...prev, selectedIdx: next } : null));
                                return true;
                            }
                            if (event.key === 'ArrowUp') {
                                const prev = Math.max(mentionSelectedIdxRef.current - 1, 0);
                                mentionSelectedIdxRef.current = prev;
                                setMentionState((s) => (s ? { ...s, selectedIdx: prev } : null));
                                return true;
                            }
                            if (event.key === 'Enter') {
                                const u = mentionItemsRef.current[mentionSelectedIdxRef.current];
                                if (u) selectMention(u);
                                return true;
                            }
                            return false;
                        },
                        onExit() {
                            mentionItemsRef.current = [];
                            mentionCommandRef.current = null;
                            clientRectRef.current = null;
                            setMentionState(null);
                        },
                    }),
                },
            }),
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
                {mentionState && mentionState.items.length > 0 && (
                    <div
                        style={{
                            position: 'fixed',
                            top: mentionState.pos.top + 4,
                            left: mentionState.pos.left,
                            zIndex: 50,
                        }}
                        className="bg-base-100 border border-base-300 rounded-box shadow-lg overflow-hidden"
                    >
                        {mentionState.items.map((u, i) => (
                            <button
                                key={u.id}
                                type="button"
                                className={`w-full text-left px-3 py-1.5 text-sm ${
                                    i === mentionState.selectedIdx
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
