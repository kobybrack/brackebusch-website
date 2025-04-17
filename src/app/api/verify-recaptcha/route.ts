export async function POST(request: Request) {
    const { token } = await request.json();

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
        return new Response('Missing secret key', { status: 500 });
    }

    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
        { method: 'POST' },
    );
    const verificationResult = await response.json();

    if (verificationResult.success) {
        return new Response('OK', { status: 200 });
    } else {
        return new Response(verificationResult['error-codes'] || 'Unknown error', { status: 400 });
    }
}
