import { auth } from '@/auth';
import dbClient from '@/lib/dbClient';
import microsoftGraphClient from '@/lib/microsoftGraphClient';

type TipTapNode = { type?: string; attrs?: { id?: string | number }; content?: TipTapNode[] };

function extractMentionIds(content: string | undefined): string[] {
    if (!content) return [];
    let doc: TipTapNode;
    try {
        doc = JSON.parse(content);
    } catch {
        return [];
    }
    const ids = new Set<string>();
    const walk = (node: TipTapNode | undefined) => {
        if (!node) return;
        if (node.type === 'mention' && node.attrs?.id != null) ids.add(String(node.attrs.id));
        node.content?.forEach(walk);
    };
    walk(doc);
    return [...ids];
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ postId: string; commentId: string }> },
) {
    const session = await auth();
    if (!session?.user) {
        return Response.json('only users with accounts can write comments', { status: 403 });
    }

    const { postId, commentId } = await params;
    const { parentCommentId } = (await request.json()) as { parentCommentId?: string };

    const commentContent = await dbClient.getCommentContent(commentId, postId);
    const mentionIds = extractMentionIds(commentContent);

    const [post, parentCommentUser, mentionedUsers] = await Promise.all([
        dbClient.getPostById(postId),
        dbClient.getCommentUser(parentCommentId),
        dbClient.getUsersByIds(mentionIds, parentCommentId),
    ]);

    const emailPromises = [];
    const notified = new Set<string>();

    if (post) {
        if (
            parentCommentUser?.email &&
            parentCommentUser.userPreferences?.replyNotifications &&
            parentCommentUser.email !== session.user?.email
        ) {
            emailPromises.push(microsoftGraphClient.sendCommentReplyEmail(parentCommentUser.email, post));
            notified.add(parentCommentUser.email);
        }

        for (const mentioned of mentionedUsers) {
            if (
                mentioned.email &&
                mentioned.replyNotifications &&
                !notified.has(mentioned.email) &&
                mentioned.email !== session.user?.email
            ) {
                const send = mentioned.hasCommentInThread
                    ? microsoftGraphClient.sendCommentReplyEmail(mentioned.email, post)
                    : microsoftGraphClient.sendMentionEmail(mentioned.email, post);
                emailPromises.push(send);
                notified.add(mentioned.email);
            }
        }
        emailPromises.push(microsoftGraphClient.sendCommentEmail(post));
    }

    await Promise.all(emailPromises);
    return new Response(null, { status: 202 });
}
