import Link from 'next/link';
import styles from '@/styles/header.module.css';

const headerPages = {
    Home: '/',
    About: '/about',
    Posts: '/posts',
};

export const Header = () => {
    return (
        <header className={styles.header}>
            <div className={`navbar bg-base-100 ${styles.nav}`}>
                <div className="navbar-start">{/* TODO navbar start stuff */}</div>
                <div className="navbar-center hidden lg:flex">
                    <ul className={styles.navList}>
                        {Object.entries(headerPages).map(([text, href], index) => (
                            <li key={index}>
                                <Link className={`${styles.navItem}`} href={href}>
                                    <b>{text}</b>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="navbar-end">{/* TODO add account */}</div>
            </div>
        </header>
    );
};
