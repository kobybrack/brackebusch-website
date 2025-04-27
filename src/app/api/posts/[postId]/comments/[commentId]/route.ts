import { auth } from '@/auth';
import dbClient from '@/lib/dbClient';

export async function DELETE(_request: Request, { params }: { params: Promise<{ commentId: string }> }) {
    const session = await auth();
    const user = session?.user;
    if (!user) {
        return new Response(null, { status: 401 });
    }
    const { commentId } = await params;
    const isAdmin = !!user.roles?.includes('admin');
    await dbClient.deleteComment(commentId, user.id as string, isAdmin);
    return new Response(null, { status: 204 });
}
