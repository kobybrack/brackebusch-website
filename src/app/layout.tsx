import '@/app/globals.css';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import ServerNavbarWrapper from '@/components/ServerNavbarWrapper';
import { ReCaptchaProvider } from 'next-recaptcha-v3';

const notoSans = Noto_Sans({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Brackebusch',
    description: "Koby Brackebusch's website",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html data-theme="koby-theme" lang="en" className={notoSans.className}>
            <body>
                <header className="pt-6 pb-6">
                    <ServerNavbarWrapper />
                </header>
                <main className="px-8">
                    <ReCaptchaProvider reCaptchaKey={process.env.RECAPTCHA_SITE_KEY}>{children}</ReCaptchaProvider>
                </main>
                <footer className="pt-2 pb-8" />
            </body>
        </html>
    );
}
