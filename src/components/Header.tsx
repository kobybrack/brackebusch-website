import Link from 'next/link';
import styles from '@/styles/header.module.css';

export const Header = () => {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li>
                        <Link href="/">
                            <b>Home</b>
                        </Link>
                    </li>
                    <li>
                        <Link href="/about">
                            <b>About</b>
                        </Link>
                    </li>
                    <li>
                        <Link href="/posts">
                            <b>Posts</b>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
