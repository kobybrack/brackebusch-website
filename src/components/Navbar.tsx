'use client';

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

export default function Navbar({ loggedIn, roles }: { loggedIn: boolean; roles: string[] }) {
    const headerPages = {
        ...baseHeaderPages,
        ...(roles.includes('missions') ? missionHeaderPages : {}),
        ...(roles.includes('editor') ? editorHeaderPages : {}),
    };

    const handleLinkClick = () => {
        document.activeElement instanceof HTMLElement && document.activeElement.blur();
    };

    const navItems = Object.entries(headerPages).map(([text, href], index) => (
        <li key={index}>
            <Link href={href} onClick={handleLinkClick}>
                {text}
            </Link>
        </li>
    ));

    const authLinkHref = loggedIn ? '/logout' : '/login';
    const authLinkString = loggedIn ? 'Log out' : 'Log in';

    return (
        <div className="w-full z-50 flex justify-center">
            <div className="navbar">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className={`btn btn-ghost btn-square sm:hidden ml-2`}>
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
                            tabIndex={0}
                            className="dropdown-content menu menu-sm bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-sm"
                        >
                            {Object.entries(headerPages).map(([text, href], index) => (
                                <li key={index}>
                                    <Link
                                        className={'!btn !btn-ghost !justify-start'}
                                        href={href}
                                        onClick={handleLinkClick}
                                    >
                                        {text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="navbar-center">
                    <ul className="hidden sm:flex gap-6 list-none m-0 p-0 menu menu-horizontal">
                        {Object.entries(headerPages).map(([text, href], index) => (
                            <li key={index}>
                                <Link className="text-lg" href={href} onClick={handleLinkClick}>
                                    {text}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="navbar-end">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className={`btn btn-ghost btn-square mr-2`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="h-8 w-8"
                                viewBox="0 0 24 24"
                                strokeWidth="1.2"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu menu-sm bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-sm"
                        >
                            {loggedIn && (
                                <li>
                                    <Link
                                        className="!btn !btn-ghost !justify-start"
                                        href="/account"
                                        onClick={handleLinkClick}
                                    >
                                        Settings
                                    </Link>
                                </li>
                            )}
                            <li key={'auth link'}>
                                <Link
                                    className="!btn !btn-ghost !justify-start"
                                    href={authLinkHref}
                                    onClick={handleLinkClick}
                                >
                                    {authLinkString}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
