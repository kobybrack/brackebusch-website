import PostServerComponent from '@/components/post/PostServerComponent';

export default async function Post({ params }: { params: Promise<{ postKey: string }> }) {
    const postKey = (await params).postKey;
    return <PostServerComponent postKey={postKey} />;
}
