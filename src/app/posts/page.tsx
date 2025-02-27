import dbClient from '@/lib/dbClient';
import Link from 'next/link';
import commonStyles from '@/styles/common.module.css';
import postStyles from '@/styles/posts.module.css';

export default async function Page() {
    const posts = await dbClient.getPosts();
    return (
        <div className={`${commonStyles.flexContainer}`} style={{ width: '100%' }}>
            <div className="prose">
                <h1>Here are the most recent posts:</h1>
                <div className={`${commonStyles.flexContainer}  ${postStyles.postsContainer}`}>
                    {posts.map((post) => (
                        <Link key={post.id} href={`/posts/${post.postKey}`}>
                            <button className="btn">{post.title}</button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
