import { auth } from '@/auth';
import dbClient from '@/lib/dbClient';

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const users = await dbClient.getAllUsers();
    return Response.json({ users });
}
