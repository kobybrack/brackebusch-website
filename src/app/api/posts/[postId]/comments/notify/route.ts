import { auth } from '@/auth';
import dbClient from '@/lib/dbClient';
import microsoftGraphClient from '@/lib/microsoftGraphClient';

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return Response.json('only users with accounts can write comments', { status: 403 });
    }
    const { postId } = await params;
    const post = await dbClient.getPostFromId(postId);
    if (post) {
        await microsoftGraphClient.sendCommentEmail(post);
    }
}
