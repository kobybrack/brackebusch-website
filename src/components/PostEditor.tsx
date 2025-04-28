'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Markdown from 'react-markdown';

interface PostEditorProps {
    text: string;
    setText: (text: string) => void;
    title: string;
    setTitle: (title: string) => void;
    setIsMissionaryPost: (isMissionaryPost: boolean) => void;
    isSubmitted: boolean;
}

export default function PostEditor({
    text,
    setText,
    title,
    setTitle,
    setIsMissionaryPost,
    isSubmitted,
}: PostEditorProps) {}
