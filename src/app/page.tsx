import commonStyles from '@/styles/common.module.css';

export default function Home() {
    return (
        <div className={`${commonStyles.flexContainer}`}>
            <div className="prose">
                <h1>Welcome :D</h1>
            </div>
        </div>
    );
}
