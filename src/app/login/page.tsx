'use client';
import { useSearchParams } from 'next/navigation';
import { useActionState, useState } from 'react';
import { login } from '@/lib/actions';
export default function Login() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirectUrl') || '/';

    const [errorMessage, formAction, isPending] = useActionState(login, undefined);
    const [loginMethod, setLoginMethod] = useState('');
    const inputClasses = `input input-bordered ${errorMessage ? 'input-error' : ''}`;
    return (
        <form action={formAction} className="flex flex-col max-w-xs justify-center mx-auto gap-4">
            {loginMethod !== 'credentials' && (
                <div className="flex flex-col gap-4">
                    <button type="submit" className="btn" onClick={() => setLoginMethod('google')}>
                        Log in with Google
                    </button>
                    <button className="btn" onClick={() => setLoginMethod('credentials')}>
                        Log in with Email
                    </button>
                </div>
            )}
            {loginMethod === 'credentials' && (
                <>
                    <div className="flex flex-col">
                        <div className="label">
                            <span className="label-text">Email</span>
                        </div>
                        <input className={inputClasses} id="email" type="email" name="email" autoComplete="off" />
                    </div>
                    <div className="flex flex-col">
                        <div className="label">
                            <span className="label-text">Password</span>
                        </div>
                        <input className={inputClasses} id="password" type="password" name="password" />
                    </div>

                    <button className="btn" disabled={isPending}>
                        Log in
                    </button>
                </>
            )}
            <input type="hidden" name="redirectTo" value={redirectUrl} />
            <input type="hidden" name="loginMethod" value={loginMethod} />
            {errorMessage && <p>{errorMessage}</p>}
        </form>
    );
}
