import Mention from '@tiptap/extension-mention';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { User } from '@/lib/types';

export type MentionDropdownState = {
    items: User[];
    selectedIdx: number;
    pos: { top: number; left: number };
};

export default function useMentionSuggestion(users: User[] | undefined) {
    const usersRef = useRef(users);
    usersRef.current = users;

    const [dropdownState, setDropdownState] = useState<MentionDropdownState | null>(null);
    const commandRef = useRef<((attrs: { id: string; label: string }) => void) | null>(null);
    const selectedIdxRef = useRef(0);
    const itemsRef = useRef<User[]>([]);
    const clientRectRef = useRef<(() => DOMRect | null | undefined) | null>(null);

    const isOpen = dropdownState !== null;
    useEffect(() => {
        if (!isOpen) return;
        const handleScroll = () => {
            const rect = clientRectRef.current?.();
            if (rect) {
                setDropdownState((prev) =>
                    prev ? { ...prev, pos: { top: rect.bottom, left: rect.left } } : null,
                );
            }
        };
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [isOpen]);

    const selectMention = useCallback((u: User) => {
        const label = u.username ?? [u.firstName, u.lastName].filter(Boolean).join(' ');
        commandRef.current?.({ id: u.id, label });
        setDropdownState(null);
    }, []);

    const extension = useMemo(
        () =>
            Mention.configure({
                HTMLAttributes: { class: 'font-bold' },
                suggestion: {
                    char: '@',
                    items: ({ query }) => {
                        if (query.length < 2 || !usersRef.current) return [];
                        const q = query.toLowerCase();
                        return usersRef.current
                            .filter(
                                (u) =>
                                    u.username?.toLowerCase().includes(q) ||
                                    `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase().trim().includes(q),
                            )
                            .slice(0, 8);
                    },
                    render: () => ({
                        onStart({ items, command, clientRect }) {
                            itemsRef.current = items as User[];
                            selectedIdxRef.current = 0;
                            commandRef.current = command;
                            clientRectRef.current = clientRect ?? null;
                            const rect = clientRect?.();
                            if (rect && items.length > 0) {
                                setDropdownState({
                                    items: items as User[],
                                    pos: { top: rect.bottom, left: rect.left },
                                    selectedIdx: 0,
                                });
                            }
                        },
                        onUpdate({ items, command, clientRect }) {
                            itemsRef.current = items as User[];
                            selectedIdxRef.current = 0;
                            commandRef.current = command;
                            clientRectRef.current = clientRect ?? null;
                            const rect = clientRect?.();
                            if (rect && items.length > 0) {
                                setDropdownState({
                                    items: items as User[],
                                    pos: { top: rect.bottom, left: rect.left },
                                    selectedIdx: 0,
                                });
                            } else {
                                setDropdownState(null);
                            }
                        },
                        onKeyDown({ event }) {
                            if (!itemsRef.current.length) return false;
                            if (event.key === 'ArrowDown') {
                                const next = Math.min(selectedIdxRef.current + 1, itemsRef.current.length - 1);
                                selectedIdxRef.current = next;
                                setDropdownState((prev) => (prev ? { ...prev, selectedIdx: next } : null));
                                return true;
                            }
                            if (event.key === 'ArrowUp') {
                                const prev = Math.max(selectedIdxRef.current - 1, 0);
                                selectedIdxRef.current = prev;
                                setDropdownState((s) => (s ? { ...s, selectedIdx: prev } : null));
                                return true;
                            }
                            if (event.key === 'Enter') {
                                const u = itemsRef.current[selectedIdxRef.current];
                                if (u) selectMention(u);
                                return true;
                            }
                            return false;
                        },
                        onExit() {
                            itemsRef.current = [];
                            commandRef.current = null;
                            clientRectRef.current = null;
                            setDropdownState(null);
                        },
                    }),
                },
            }),
        [selectMention],
    );

    return { extension, dropdownState, selectMention };
}
