export default function About() {
    return (
        <div className="w-full max-w-(--breakpoint-md) mx-auto">
            <div className="prose">
                <h1>About</h1>
                <h2 className="mt-0">Koby</h2>
                <p>
                    My name is Koby Brackebusch. I would describe myself as zealous. I get very passionate about
                    everything that enters my life. This website is a way for me to post about my passions. My hope is
                    that I can convey myself in a way that is enticing and draws people in to the things that I love.
                    Here are some random things about me:
                </p>
                <ul>
                    <li>
                        I grew up in Duvall, Washington, in a <em>very large</em> family
                    </li>
                    <li>I love music so much, which has led me to learning a lot of instruments</li>
                    <li>I work as a software engineer</li>
                    <li>I&apos;m 5&apos;8&quot;</li>
                    <li>I have ADHD, which is apparently not surprising to some</li>
                </ul>
                <h2 className="mt-0">This website</h2>
                <p>
                    This is a NextJs project hosted by Vercel. All of the content for the website is stored in a Neon
                    database and the Images are stored in Vercel Blob. Feel free to take a look at{' '}
                    <a href="https://github.com/kobybrack/brackebusch-website">my repo on GitHub</a>!
                </p>
            </div>
        </div>
    );
}
