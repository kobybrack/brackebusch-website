'use client';

import { Post } from '@/lib/types';
import { useState } from 'react';
import { PostPreviewCard } from './PostPreviewCard';

interface PostsListProps {
    posts: Post[];
}

export const PostsList = ({ posts }: PostsListProps) => {
    const [searchText, setSearchText] = useState('');

    return (
        <div className="flex flex-col justify-center items-center gap-6 mx-auto w-full max-w-screen-md">
            <input
                autoComplete="off"
                placeholder="Search"
                className="input input-bordered mt-1 w-[99%]"
                value={searchText}
                onChange={(e) => setSearchText(e.target?.value.toLowerCase())}
            ></input>
            {posts
                .filter((post) => {
                    const rawTitle = post.title.toLowerCase();
                    const rawContent = post.rawText.toLowerCase();
                    return rawTitle.includes(searchText) || rawContent.includes(searchText);
                })
                .map((post) => (
                    <PostPreviewCard key={post.id} post={post} />
                ))}
        </div>
    );
};
