'use client';

import { Fragment, useState } from 'react';
import { useGetComments } from '@/hooks/commentHooks';
import LoadingSpinnerWithText from '../LoadingSpinnerWithText';
import { User } from '@/lib/types';
import { Comment as CommentType } from '@/lib/types';
import Comment from '@/components/comments/Comment';
import CommentTextBox from './CommentTextBox';

const INITIAL_COMMENTS_TO_SHOW = 4;

type ActiveReply = {
    topLevelId: string;
    mentionUser?: CommentType['userData'];
    position: 'top' | string;
};

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
    const [activeReply, setActiveReply] = useState<ActiveReply | null>(null);
    const [openThreads, setOpenThreads] = useState<Set<string>>(new Set());

    const openThread = (id: string) =>
        setOpenThreads((prev) => {
            if (prev.has(id)) return prev;
            const next = new Set(prev);
            next.add(id);
            return next;
        });

    const toggleThread = (id: string) =>
        setOpenThreads((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

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
                    const isActive = activeReply?.topLevelId === comment.id;
                    const replyTarget = (isActive && activeReply.mentionUser) || comment.userData;
                    const threadOpen = openThreads.has(comment.id);

                    const replyTextbox = isActive && (
                        <CommentTextBox
                            key={replyTarget.userId}
                            postId={postId}
                            user={user}
                            postKey={postKey}
                            closeReplyTextbox={() => setActiveReply(null)}
                            openReplies={() => openThread(comment.id)}
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
                                    const isShowingAtTop = isActive && activeReply.position === 'top';
                                    setActiveReply(
                                        isShowingAtTop ? null : { topLevelId: comment.id, position: 'top' },
                                    );
                                }}
                                repliesOpen={threadOpen}
                                onToggleReplies={() => toggleThread(comment.id)}
                            />
                            {(isActive || threadOpen) && (
                                <div className="ml-16 flex flex-col gap-4">
                                    {/* Textbox at top when replying to the top-level comment */}
                                    {isActive && activeReply.position === 'top' && replyTextbox}
                                    {threadOpen &&
                                        comment.replies.map((reply) => (
                                            <Fragment key={reply.id}>
                                                <Comment
                                                    comment={reply}
                                                    user={user}
                                                    onReplyToSub={(userData, subCommentId) => {
                                                        setActiveReply({
                                                            topLevelId: comment.id,
                                                            mentionUser: userData,
                                                            position: subCommentId,
                                                        });
                                                        openThread(comment.id);
                                                    }}
                                                />
                                                {/* Textbox directly under the sub-comment it was triggered from */}
                                                {isActive && activeReply.position === reply.id && replyTextbox}
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
