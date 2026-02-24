import { Comment as CommentType, User } from '@/lib/types';
import { timeAgo } from '@/lib/miscHelpers';
import { useDeleteComment } from '@/hooks/commentHooks';
import { useState, Dispatch, SetStateAction } from 'react';
import CommentTextBox from './CommentTextBox';

export default function CommentComponent({
    comment,
    user,
    setShowParentReplyTextbox,
    showRepliesMap,
    setShowRepliesMap,
}: {
    comment: CommentType;
    user: User | undefined;
    setShowParentReplyTextbox: Dispatch<SetStateAction<Record<string, boolean>>>;
    showRepliesMap?: Record<string, boolean>;
    setShowRepliesMap?: Dispatch<SetStateAction<Record<string, boolean>>>;
}) {
    const { deleteComment } = useDeleteComment(comment.postId);
    const [showReplyTextbox, setShowReplyTextbox] = useState(false);

    return (
        <div>
            <div id={`comment-${comment.id}`} className="bg-base-200 rounded-box p-4">
                {comment.deletedAt ? (
                    <span className="text-base-content/25 italic">this comment was deleted</span>
                ) : (
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <span className="font-bold">
                                    {comment.userData.firstName
                                        ? comment.userData.firstName +
                                          ' ' +
                                          (comment.userData.lastName?.slice(0, 1) || '')
                                        : comment.userData.username}
                                </span>
                                <span className="text-base-content/25 text-sm">
                                    {(comment.updatedAt !== comment.createdAt ? 'edited:' : '') + ' '}
                                    {timeAgo(comment.updatedAt)}
                                </span>
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
                        <p>{comment.content}</p>
                        <div className="flex justify-start items-center gap-1 h-[30px]">
                            {!comment.parentCommentId && (
                                <button
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => {
                                        if (comment.parentCommentId) {
                                            setShowReplyTextbox((prev) => !prev);
                                        } else {
                                            setShowParentReplyTextbox((prev) => ({
                                                ...prev,
                                                [comment.id]: !prev[comment.id],
                                            }));
                                        }
                                    }}
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
            {showReplyTextbox && (
                <CommentTextBox
                    user={user}
                    postId={comment.postId}
                    postKey={''}
                    closeReplyTextbox={() => setShowReplyTextbox(false)}
                    openReplies={() => {}}
                    parentCommentId={comment.parentCommentId || comment.id}
                />
            )}
        </div>
    );
}
