import '@/app/globals.css';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Noto_Sans } from 'next/font/google';

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
        <html lang="en" className={notoSans.className}>
            <body>
                <header className="pt-6 pb-6">
                    <Navbar />
                </header>
                <main className="px-8">{children}</main>
                <footer className="pt-2 pb-8" />
            </body>
        </html>
    );
}
