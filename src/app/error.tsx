'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col justify-center items-center max-w-sm mx-auto gap-4">
            <div className="alert alert-error">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>{'Oh shoot, something went wrong :('}</span>
            </div>
            <p>
                I would really appreciate if you let me know what you were doing when this happened so I can fix it!
                Thank you!
                <br />- Koby
            </p>
            <div className="flex gap-4">
                <button className="btn" onClick={() => redirect('/')}>
                    Go Home
                </button>
                <button className="btn" onClick={() => reset()}>
                    Try again
                </button>
            </div>
        </div>
    );
}
