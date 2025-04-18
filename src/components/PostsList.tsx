'use client';

import { Post } from '@/lib/types';
import { useState } from 'react';
import PostPreviewCard from '@/components/PostPreviewCard';

interface PostsListProps {
    posts: Post[];
}

export default function PostsList({ posts }: PostsListProps) {
    const [searchText, setSearchText] = useState('');

    return (
        <div className="flex flex-col justify-center items-center gap-6 mx-auto w-full max-w-(--breakpoint-md)">
            <input
                autoComplete="off"
                placeholder="Search"
                className="input mt-1 w-[99%]"
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
}
