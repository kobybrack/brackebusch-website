import LoadingSpinnerWithText from '@/components/LoadingSpinnerWithText';
import PostPreviewCard from '@/components/post/PostPreviewCard';
import dbClient from '@/lib/dbClient';
import Link from 'next/link';
import { Suspense } from 'react';
import { auth } from '@/auth';

export default function Home() {
    const renderLatestPosts = async () => {
        const session = await auth();
        const hasMissionsAccess = session?.user?.roles?.includes('missions');
        const posts = await dbClient.getLatestPosts(hasMissionsAccess);
        return (
            <div className="flex flex-col gap-6">
                {posts.map((post) => (
                    <PostPreviewCard key={post.id} post={post} />
                ))}
            </div>
        );
    };
    return (
        <div className="w-full max-w-(--breakpoint-md) mx-auto h-full">
            <div className="prose">
                <h1>Welcome!</h1>
                <p>
                    I'm Koby. I made this website to post my random thoughts, hobbies, life updates, and other things.
                    I'm thinking of it as a digital archive of my life. It's also a way I can keep up with my friends
                    and catch up my new friends, since I don't really use social media. I hope you like it!
                </p>
                <h2 className="mt-0">Latest posts:</h2>
                <div className="flex flex-col gap-6">
                    <Suspense fallback={<LoadingSpinnerWithText loadingText="Loading..." leftAligned />}>
                        {renderLatestPosts()}
                        <Link href={'/posts'}>
                            <button className="btn h-[50px]">See all posts</button>
                        </Link>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
