import Link from 'next/link';
import homeStyles from '@/styles/home.module.css';
import commonStyles from '@/styles/common.module.css';

export default function Home() {
    return (
        <div className={`${commonStyles.flexContainer}`}>
            <h1 className={homeStyles.welcomeText}>Welcome!</h1>
            <button className="btn">
                <Link href="/posts">Posts page</Link>
            </button>
        </div>
    );
}
