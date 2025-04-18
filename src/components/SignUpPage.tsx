'use client';

import { createEmailUser } from '@/lib/actions';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useResettableActionState } from '@/hooks/useResettableActionState';
import Link from 'next/link';

export default function SignUpPage() {
    const { executeRecaptcha } = useReCaptcha();

    const verifyAndCreateUser = async (_: string | undefined, formData: FormData) => {
        const token = await executeRecaptcha('create_email_account');
        const response = await fetch('/api/verify-recaptcha', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });

        if (!response?.ok) {
            const error = await response.text();
            return `Recaptcha validation failed: ${error}`;
        }

        return await createEmailUser(_, formData);
    };

    const [errorMessage, formAction, isPending, reset] = useResettableActionState(verifyAndCreateUser, undefined);
    const inputClasses = `input ${errorMessage ? 'input-error' : ''}`;
    const error = errorMessage && <p className="text-error text-center">{errorMessage}</p>;

    return (
        <form action={formAction} className="flex flex-col justify-center items-center gap-4">
            <fieldset className="fieldset w-sm border border-base-200 p-4 rounded-box">
                <label className="fieldset-legend">Sign up</label>
                <label className="fieldset-label justify-between">Email {error}</label>
                <label className={`${inputClasses} validator w-full`}>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        autoComplete="off"
                        onChange={reset}
                        pattern="[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,}"
                    />
                </label>

                <label className="fieldset-label">Password</label>

                <div>
                    <label className={`${inputClasses} validator w-full`}>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            required
                            onChange={reset}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                        />
                    </label>
                    <p className="validator-hint hidden -mb-2">
                        Must be more than 8 characters, including
                        <br />
                        At least one number
                        <br />
                        At least one lowercase letter
                        <br />
                        At least one uppercase letter
                    </p>
                </div>

                <button className="btn mt-2" type="submit" disabled={isPending}>
                    Create account
                </button>

                <span className="text-center mt-2">
                    {'Already have an account? '}
                    <Link href="/login?loginMethod=credentials" className="link">
                        Log in
                    </Link>
                </span>

                <input type="hidden" name="redirectTo" value={'/'} />
            </fieldset>
        </form>
    );
}
