import type { Metadata } from 'next';
import '@/app/globals.css';
import styles from '@/styles/root.module.css';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
    title: 'Brackebusch',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Header />
                <main>{children}</main>
            </body>
        </html>
    );
}
