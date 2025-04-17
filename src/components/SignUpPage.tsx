'use client';

import { createEmailUser } from '@/lib/actions';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useResettableActionState } from '@/hooks/useResettableActionState';

export default function SignUpPage() {
    const { executeRecaptcha } = useReCaptcha();

    const handleSubmit = async (_: string | undefined, formData: FormData) => {
        const token = await executeRecaptcha('create_email_account');
        const response = await fetch('/api/verify-recaptcha', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });

        if (!response?.ok) {
            const error = await response.text();
            return `Recaptcha validation failed: ${error}`;
        }

        // TODO: verify email is an email
        return await createEmailUser(_, formData);
    };
    const [errorMessage, formAction, isPending, reset] = useResettableActionState(handleSubmit, undefined);
    const inputClasses = `input ${errorMessage ? 'input-error' : ''}`;
    const error = errorMessage && <p className="text-error text-center">{errorMessage}</p>;

    return (
        <form action={formAction} className="flex flex-col max-w-xs justify-center mx-auto gap-4">
            <fieldset className="fieldset w-xs mx-auto">
                <label className="fieldset-label justify-between">Email {error}</label>
                <input className={inputClasses} id="email" name="email" autoComplete="off" onChange={reset} />

                <label className="fieldset-label">Password</label>
                <input className={inputClasses} id="password" type="password" name="password" onChange={reset} />

                <button className="btn mt-4" type="submit" disabled={isPending}>
                    Create account
                </button>

                <input type="hidden" name="redirectTo" value={'/'} />
            </fieldset>
        </form>
    );
}
