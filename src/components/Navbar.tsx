'use client';
import { Session } from 'next-auth';
import Link from 'next/link';
import { useState } from 'react';

const baseHeaderPages = {
    Home: '/',
    About: '/about',
    Posts: '/posts',
};

const missionHeaderPages = {
    Missions: '/missions',
};

const editorHeaderPages = {
    Editor: '/editor',
};

export const Navbar = ({ session }: { session: Session | null }) => {
    const [menuDisplay, setMenuDisplay] = useState(true);
    const [displayMenuStyle, setDisplayMenuStyle] = useState('');

    const roles = session?.user?.roles || [];
    const headerPages = {
        ...baseHeaderPages,
        ...(roles.includes('missions') ? missionHeaderPages : {}),
        ...(roles.includes('editor') ? editorHeaderPages : {}),
    };

    const showMenu = () => {
        setMenuDisplay(!menuDisplay);
        if (menuDisplay) {
            setDisplayMenuStyle('');
        } else {
            setDisplayMenuStyle('none');
        }
    };

    const handleLinkClick = () => {
        document.activeElement instanceof HTMLElement && document.activeElement.blur();
    };

    const navItems = Object.entries(headerPages).map(([text, href], index) => (
        <li key={index}>
            <Link className="text-lg" href={href} onClick={handleLinkClick}>
                {text}
            </Link>
        </li>
    ));

    const authLinkHref = session?.user ? '/logout' : '/login';
    const authLinkString = session?.user ? 'Log out' : 'Log in';

    return (
        <div className="w-full z-50 flex justify-center">
            <div className="navbar">
                <div className="navbar-start">
                    <div className="dropdown" onClick={showMenu}>
                        <div tabIndex={0} role="button" className="btn btn-ghost sm:hidden ml-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>
                        <ul
                            style={{ display: displayMenuStyle }}
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            {navItems}
                        </ul>
                    </div>
                </div>
                <div className="navbar-center">
                    <ul className="hidden sm:flex gap-6 list-none m-0 p-0 menu menu-horizontal">{navItems}</ul>
                </div>
                <div className="navbar-end">
                    <div className="mr-2">
                        <Link href={authLinkHref}>
                            <button className="btn btn-ghost">{authLinkString}</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
