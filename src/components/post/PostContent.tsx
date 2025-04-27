'use client';

import Markdown from 'react-markdown';
import { Post } from '@/lib/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Zoom, Thumbnails } from 'yet-another-react-lightbox/plugins';
import Lightbox, { SlideImage } from 'yet-another-react-lightbox';

type PostContentProps = {
    post: Post;
};

export default function PostContent({ post }: PostContentProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [slides, setSlides] = useState<SlideImage[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const newSlides: SlideImage[] = [];
        post.content.replace(/!\[([^\]]*)]\(([^)]+)\)/g, (match, alt, src) => {
            newSlides.push({ src, alt });
            return match;
        });
        setSlides(newSlides);
    }, [post.content]);

    const handleImageClick = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    return (
        <div className="w-full">
            <div className="prose">
                <h1>{post.title}</h1>
                <Markdown
                    children={post.content}
                    components={{
                        img(props) {
                            const { src, alt } = props;
                            if (src) {
                                const index = slides.findIndex((slide) => slide.src === src);
                                return (
                                    <Image
                                        src={src}
                                        alt={alt || 'post image'}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="w-full h-auto"
                                        onClick={() => handleImageClick(index)}
                                    />
                                );
                            }
                            return undefined;
                        },
                    }}
                />
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    controller={{ closeOnBackdropClick: true }}
                    index={currentIndex}
                    slides={slides}
                    animation={{
                        fade: 0,
                        swipe: 0,
                        navigation: 0,
                        easing: {
                            fade: 'linear',
                            swipe: 'linear',
                            navigation: 'linear',
                        },
                        zoom: 50,
                    }}
                    thumbnails={{
                        gap: 8,
                        padding: 0,
                        border: 0,
                        vignette: false,
                    }}
                    plugins={[Zoom, Thumbnails]}
                />
            </div>
        </div>
    );
}
