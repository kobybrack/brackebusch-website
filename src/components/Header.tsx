import Link from 'next/link';
import styles from '@/styles/header.module.css';

export const Header = () => {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {['Home', 'About', 'Posts'].map((text, index) => (
                        <li key={index}>
                            <Link className={styles.navItem} href={`/${text.toLowerCase()}`}>
                                <b>{text}</b>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};
