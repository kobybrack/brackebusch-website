'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { ReactNode, useState } from 'react';

export default function Providers({ children, siteKey }: { children: ReactNode; siteKey: string }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,
                    },
                },
            }),
    );
    return (
        <QueryClientProvider client={queryClient}>
            <ReCaptchaProvider reCaptchaKey={siteKey}>{children}</ReCaptchaProvider>
        </QueryClientProvider>
    );
}
