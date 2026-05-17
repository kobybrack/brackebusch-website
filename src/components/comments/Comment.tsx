import { Comment as CommentType, User } from '@/lib/types';
import { timeAgo } from '@/lib/miscHelpers';
import { useDeleteComment } from '@/hooks/commentHooks';
import { Dispatch, SetStateAction } from 'react';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';

function renderContent(content: string) {
    try {
        const json = JSON.parse(content);
        if (json?.type === 'doc') {
            const html = generateHTML(json, [
                StarterKit,
                Mention.configure({ HTMLAttributes: { class: 'font-bold' } }),
            ]);
            return <div dangerouslySetInnerHTML={{ __html: html }} />;
        }
    } catch {
        // fall through
    }
    // Plain-text fallback for comments stored before JSON format
    return (
        <p>
            {content.split(/(@\w+)/).map((part, i) => (/^@\w+$/.test(part) ? <strong key={i}>{part}</strong> : part))}
        </p>
    );
}

export default function CommentComponent({
    comment,
    user,
    onReply,
    showRepliesMap,
    setShowRepliesMap,
    onReplyToSub,
}: {
    comment: CommentType;
    user: User | undefined;
    onReply?: () => void;
    showRepliesMap?: Record<string, boolean>;
    setShowRepliesMap?: Dispatch<SetStateAction<Record<string, boolean>>>;
    onReplyToSub?: (userData: CommentType['userData'], subCommentId: string) => void;
}) {
    const { deleteComment } = useDeleteComment(comment.postId);

    return (
        <div>
            <div id={`comment-${comment.id}`} className="bg-base-200 rounded-box p-4">
                {comment.deletedAt ? (
                    <span className="text-base-content/25 italic">this comment was deleted</span>
                ) : (
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-sm">
                                            {comment.userData.firstName
                                                ? comment.userData.firstName +
                                                  ' ' +
                                                  (comment.userData.lastName?.slice(0, 1) || '')
                                                : comment.userData.username}
                                        </span>
                                        {comment.userData.firstName && (
                                            <span className="text-base-content/50 text-sm">
                                                @{comment.userData.username}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-base-content/35 text-xs">
                                        {comment.updatedAt !== comment.createdAt ? 'edited ' : ''}
                                        {timeAgo(comment.updatedAt)}
                                    </span>
                                </div>
                            </div>
                            <div>
                                {(user?.id === comment.userData.userId || user?.roles?.includes('admin')) && (
                                    <div className="dropdown dropdown-left">
                                        <div role="button" className="btn btn-ghost btn-square btn-sm" tabIndex={0}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                                />
                                            </svg>
                                        </div>
                                        <ul
                                            tabIndex={0}
                                            className="dropdown-content menu menu-sm bg-base-100 rounded-box z-1 shadow-sm"
                                        >
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        (document.activeElement as HTMLElement).blur();
                                                        deleteComment(comment);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        {renderContent(comment.content)}
                        <div className="flex justify-start items-center gap-1 h-[30px]">
                            {!comment.parentCommentId && onReply && (
                                <button className="btn btn-sm btn-ghost" onClick={onReply}>
                                    Reply
                                </button>
                            )}
                            {comment.parentCommentId && onReplyToSub && (
                                <button
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => onReplyToSub(comment.userData, comment.id)}
                                >
                                    Reply
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {comment.replies.length > 0 && (
                <button
                    className="btn btn-ghost btn-sm mt-2"
                    onClick={() => {
                        if (setShowRepliesMap) {
                            setShowRepliesMap((prev) => ({
                                ...prev,
                                [comment.id]: !prev[comment.id],
                            }));
                        }
                    }}
                >
                    {showRepliesMap && showRepliesMap[comment.id]
                        ? `Hide ${comment.replies.length} ${comment.replies.length > 1 ? 'replies' : 'reply'}`
                        : `View ${comment.replies.length} ${comment.replies.length > 1 ? 'replies' : 'reply'}`}
                </button>
            )}
        </div>
    );
}
