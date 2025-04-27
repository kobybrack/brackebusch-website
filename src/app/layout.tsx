import './globals.css';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import ServerNavbarWrapper from '@/components/ServerNavbarWrapper';
import Providers from '@/components/Providers';

const notoSans = Noto_Sans({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Brackebusch',
    description: "Koby Brackebusch's website",
};

const htmlStyles = {
    margin: 0,
    padding: 0,
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column' as 'column',
    overflow: 'auto',
};

const bodyStyles = {
    ...htmlStyles,
    minHeight: '100%',
};

const mainStyles = {
    flexGrow: 1,
    overflow: 'auto',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html data-theme="koby-theme" lang="en" className={notoSans.className} style={htmlStyles}>
            <body style={bodyStyles}>
                <header className="pt-6 pb-6">
                    <ServerNavbarWrapper />
                </header>
                <main className="px-8" style={mainStyles}>
                    <Providers siteKey={process.env.RECAPTCHA_SITE_KEY || ''}>{children}</Providers>
                </main>
                <footer className="pt-2 pb-8" />
            </body>
        </html>
    );
}
