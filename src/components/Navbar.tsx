'use client';
import Link from 'next/link';

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
        <div className="pt-10 pb-5 w-full z-50 flex justify-center">
            <div className={`navbar bg-base-100 w-11/12 mx-auto`}>
                <div className="navbar-start">{/* TODO navbar start stuff */}</div>
                <div className="navbar-center">
                    <ul className="flex list-none m-0 p-0 menu menu-horizontal">
                        {Object.entries(headerPages).map(([text, href], index) => (
                            <li key={index}>
                                <Link className="mr-5 text-lg" href={href} onClick={handleLinkClick}>
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
