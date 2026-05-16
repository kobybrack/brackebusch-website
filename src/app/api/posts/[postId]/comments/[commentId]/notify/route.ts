import { auth } from '@/auth';
import dbClient from '@/lib/dbClient';
import microsoftGraphClient from '@/lib/microsoftGraphClient';

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return Response.json('only users with accounts can write comments', { status: 403 });
    }

    const { postId } = await params;
    const { mentionIds = [] } = (await request.json()) as {
        parentCommentId?: string;
        mentionIds?: string[];
    };

    const [post, mentionedUsers] = await Promise.all([
        dbClient.getPostById(postId),
        dbClient.getUsersByIds(mentionIds, postId),
    ]);

    const emailPromises = [];
    const notified = new Set<string>();

    if (post) {
        for (const mentioned of mentionedUsers) {
            if (
                mentioned.email &&
                mentioned.userPreferences?.replyNotifications &&
                !notified.has(mentioned.email) &&
                mentioned.email !== session.user?.email
            ) {
                const send = mentioned.hasCommentInPost
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
