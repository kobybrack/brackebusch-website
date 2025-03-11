'use client';
import Link from 'next/link';
import { useState } from 'react';

const headerPages = {
    Home: '/',
    About: '/about',
    Posts: '/posts',
};

export const Navbar = () => {
    const [menuDisplay, setmenuDisplay] = useState(true);
    const [displayMenuStyle, setdisplayMenuStyle] = useState('');

    const showMenu = () => {
        setmenuDisplay(!menuDisplay);
        if (menuDisplay) {
            setdisplayMenuStyle('');
        } else {
            setdisplayMenuStyle('none');
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

    return (
        <div className="w-full z-50 flex justify-center">
            <div className="navbar">
                <div className="navbar-start">
                    <div className="dropdown" onClick={showMenu}>
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost sm:hidden"
                            style={{ marginLeft: '.5rem' }}
                        >
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
                <div className="navbar-center border-solid border-b-2 border-base-300 max-w-screen-md">
                    <ul className="hidden sm:flex gap-6 list-none m-0 p-0 menu menu-horizontal">{navItems}</ul>
                </div>
                <div className="navbar-end">{/* TODO add account */}</div>
            </div>
        </div>
    );
};
