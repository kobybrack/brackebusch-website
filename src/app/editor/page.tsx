'use client';

import { useState } from 'react';
import { submitPost } from '../../lib/actions';
import { PostEditor } from '@/components/PostEditor';

// Editor page
export default function Page() {
    const [text, setText] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [isMissionaryPost, setIsMissionaryPost] = useState<boolean>(false);
    const [postId, setPostId] = useState<number | undefined>(undefined);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const formAction = async (formData: FormData) => {
        (document.getElementById('submit_modal') as any).showModal();
        formData.append('content', text);
        formData.append('title', title);
        const postKey = title.replace(/\s+/g, '-').toLowerCase().slice(0, 50);
        formData.append('post_key', postKey);
        formData.append('content_type', 'markdown');
        formData.append('missionary_post', isMissionaryPost.toString());
        formData.append('id', postId ? postId.toString() : '');
        const post = await submitPost(formData);
        setPostId(post?.id);
        setIsSubmitted(true);
    };

    return (
        <>
            <form className="h-full flex flex-col max-w-screen-md mx-auto" action={formAction}>
                <PostEditor
                    text={text}
                    setText={setText}
                    title={title}
                    setTitle={setTitle}
                    setIsMissionaryPost={setIsMissionaryPost}
                    isSubmitted={isSubmitted}
                />
            </form>
        </>
    );
}
