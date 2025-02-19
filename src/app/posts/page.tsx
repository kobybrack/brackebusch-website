import dbClient from '@/lib/dbClient';
import Link from 'next/link';
import commonStyles from '@/styles/common.module.css';
import postStyles from '@/styles/posts.module.css';

export default async function Page() {
    const posts = await dbClient.getPosts();
    return (
        <div className={`${commonStyles.flexContainer} ${postStyles.postsContainer}`}>
            <h1 className={postStyles.postsHeaderText}>Here are the most recent posts:</h1>
            {posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.postKey}`}>
                    <button className="btn">{post.title}</button>
                </Link>
            ))}
        </div>
    );
}
