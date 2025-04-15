'use client';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { useActionState } from 'react';
import { createEmailUser } from '@/lib/actions';

export default async function SignUp() {
    const session = await auth();
    if (session?.user) {
        redirect('/');
    }

    const [errorMessage, formAction, isPending] = useActionState(createEmailUser, undefined);
    const inputClasses = `input input-bordered ${errorMessage ? 'input-error' : ''}`;

    return (
        <form action={formAction} className="flex flex-col max-w-xs justify-center mx-auto gap-4">
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

            <input type="hidden" name="redirectTo" value={''} />

            <button className="btn" disabled={isPending}>
                Create account
            </button>

            {errorMessage && <p>{errorMessage}</p>}
        </form>
    );
}
