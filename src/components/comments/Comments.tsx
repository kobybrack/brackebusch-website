'use client';

import { Fragment, useState } from 'react';
import { useGetComments } from '@/hooks/commentHooks';
import LoadingSpinnerWithText from '../LoadingSpinnerWithText';
import { User } from '@/lib/types';
import { Comment as CommentType } from '@/lib/types';
import Comment from '@/components/comments/Comment';
import CommentTextBox from './CommentTextBox';

const INITIAL_COMMENTS_TO_SHOW = 4;

export default function Comments({
    postId,
    postKey,
    user,
}: {
    postId: string;
    postKey: string;
    user: User | undefined;
}) {
    const { data: comments, isLoading } = useGetComments(postId);

    const [showAllComments, setShowAllComments] = useState(false);
    const [showRepliesMap, setShowRepliesMap] = useState<Record<string, boolean>>({});
    const [showReplyTextboxMap, setShowReplyTextboxMap] = useState<Record<string, boolean>>({});
    const [replyMentionMap, setReplyMentionMap] = useState<Record<string, CommentType['userData']>>({});
    const [replyPositionMap, setReplyPositionMap] = useState<Record<string, string | null>>({});

    return (
        <div className="flex flex-col gap-4 justify-start items-center w-full mb-8">
            <div className="divider font-bold">Comments</div>
            <CommentTextBox
                postId={postId}
                user={user}
                postKey={postKey}
                closeReplyTextbox={() => {}}
                openReplies={() => {}}
            />
            {isLoading ? (
                <LoadingSpinnerWithText loadingText={'Loading comments...'} />
            ) : (
                comments &&
                comments.slice(0, showAllComments ? comments.length : INITIAL_COMMENTS_TO_SHOW).map((comment) => {
                    const replyTarget = replyMentionMap[comment.id] ?? comment.userData;
                    const replyPosition = replyPositionMap[comment.id] ?? null;

                    const replyTextbox = showReplyTextboxMap[comment.id] && (
                        <CommentTextBox
                            key={replyTarget.userId}
                            postId={postId}
                            user={user}
                            postKey={postKey}
                            closeReplyTextbox={() =>
                                setShowReplyTextboxMap((prev) => ({ ...prev, [comment.id]: false }))
                            }
                            openReplies={() =>
                                setShowRepliesMap((prev) => ({ ...prev, [comment.id]: true }))
                            }
                            parentCommentId={comment.id}
                            replyTo={{
                                id: replyTarget.userId,
                                username: replyTarget.username,
                                firstName: replyTarget.firstName,
                                lastName: replyTarget.lastName,
                            }}
                        />
                    );

                    return (
                        <div key={comment.id} className="w-full flex flex-col gap-4">
                            <Comment
                                comment={comment}
                                user={user}
                                onReply={() => {
                                    const isShowingAtTop =
                                        showReplyTextboxMap[comment.id] && replyPositionMap[comment.id] === null;
                                    setShowReplyTextboxMap((prev) => ({ ...prev, [comment.id]: !isShowingAtTop }));
                                    setReplyPositionMap((prev) => ({ ...prev, [comment.id]: null }));
                                    setReplyMentionMap((prev) => {
                                        const next = { ...prev };
                                        delete next[comment.id];
                                        return next;
                                    });
                                }}
                                showRepliesMap={showRepliesMap}
                                setShowRepliesMap={setShowRepliesMap}
                            />
                            {(showReplyTextboxMap[comment.id] || showRepliesMap[comment.id]) && (
                                <div className="ml-16 flex flex-col gap-4">
                                    {/* Textbox at top when replying to the top-level comment */}
                                    {replyPosition === null && replyTextbox}
                                    {showRepliesMap[comment.id] &&
                                        comment.replies.map((reply) => (
                                            <Fragment key={reply.id}>
                                                <Comment
                                                    comment={reply}
                                                    user={user}
                                                    onReplyToSub={(userData, subCommentId) => {
                                                        setShowReplyTextboxMap((prev) => ({ ...prev, [comment.id]: true }));
                                                        setShowRepliesMap((prev) => ({ ...prev, [comment.id]: true }));
                                                        setReplyMentionMap((prev) => ({ ...prev, [comment.id]: userData }));
                                                        setReplyPositionMap((prev) => ({ ...prev, [comment.id]: subCommentId }));
                                                    }}
                                                />
                                                {/* Textbox directly under the sub-comment it was triggered from */}
                                                {replyPosition === reply.id && replyTextbox}
                                            </Fragment>
                                        ))}
                                </div>
                            )}
                        </div>
                    );
                })
            )}
            {comments && comments.length > INITIAL_COMMENTS_TO_SHOW && (
                <div className="flex justify-start">
                    {showAllComments ? (
                        <button className="btn btn-sm btn-ghost" onClick={() => setShowAllComments((prev) => !prev)}>
                            Show less
                        </button>
                    ) : (
                        <button className="btn btn-sm btn-ghost" onClick={() => setShowAllComments((prev) => !prev)}>
                            Show all
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
