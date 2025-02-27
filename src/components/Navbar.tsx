'use client';

import Link from 'next/link';
import styles from '@/styles/header.module.css';

const headerPages = {
    Home: '/',
    About: '/about',
    Posts: '/posts',
};

export const Navbar = () => {
    const handleLinkClick = () => {
        document.activeElement instanceof HTMLElement && document.activeElement.blur();
    };

    return (
        <div className={styles.header}>
            <div className={`navbar bg-base-100 ${styles.nav}`}>
                <div className="navbar-start">{/* TODO navbar start stuff */}</div>
                <div className="navbar-center hidden lg:flex">
                    <ul className={styles.navList}>
                        {Object.entries(headerPages).map(([text, href], index) => (
                            <li key={index}>
                                <Link className={`${styles.navItem}`} href={href} onClick={handleLinkClick}>
                                    <b>{text}</b>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="navbar-end">{/* TODO add account */}</div>
            </div>
        </div>
    );
};