import type { Metadata } from 'next';
import '@/app/globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
    title: 'Brackebusch',
    description: "Koby's website about his life",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    return (
        <html lang="en">
            <body>
                <header>
                    <Navbar/>
                </header>
                <main>{children}</main>
            </body>
        </html>
    );
}
