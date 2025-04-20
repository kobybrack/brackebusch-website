export default function RecaptchaDisclaimer() {
    return (
        <>
            {'This site is protected by reCAPTCHA and the Google '}
            <a className="link link-primary" href="https://policies.google.com/privacy">
                Privacy Policy
            </a>{' '}
            {'and '}
            <a className="link link-primary" href="https://policies.google.com/terms">
                Terms of Service
            </a>{' '}
            apply.
        </>
    );
}
