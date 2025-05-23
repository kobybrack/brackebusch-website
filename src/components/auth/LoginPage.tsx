'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/lib/actions';
import Link from 'next/link';
import useResettableActionState from '@/hooks/useResettableActionState';
import { useReCaptcha } from 'next-recaptcha-v3';
import RecaptchaDisclaimer from '../RecaptchaDisclaimer';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirectUrl') || '/';
    const initialLoginMethod = searchParams.get('loginMethod') || '';

    const { executeRecaptcha } = useReCaptcha();

    const verifyAndLogIn = async (_: string | null, formData: FormData) => {
        if (formData.get('loginMethod') === 'credentials') {
            const token = await executeRecaptcha('log_in');
            const response = await fetch('/api/verify-recaptcha', {
                method: 'POST',
                body: JSON.stringify({ token }),
            });

            if (!response?.ok) {
                const error = await response.text();
                return `Recaptcha validation failed: ${error}`;
            }
        }

        return await login(_, formData);
    };

    const [errorMessage, formAction, isPending, reset] = useResettableActionState(verifyAndLogIn, null);
    const [loginMethod, setLoginMethod] = useState(initialLoginMethod);
    const inputClasses = `input w-full ${errorMessage ? 'input-error' : ''}`;
    const error = errorMessage && <p className="text-error text-center">{errorMessage}</p>;
    const borderClasses = `border ${loginMethod === 'credentials' ? 'border border-base-200 rounded-box' : ''}`;

    return (
        <form action={formAction} className="h-full flex flex-col justify-between items-center gap-4">
            <fieldset className={`fieldset w-sm p-4 ${borderClasses}`}>
                {loginMethod !== 'credentials' && (
                    <div className="flex flex-col gap-4">
                        <button
                            className="btn bg-base-200 border-base-100"
                            onClick={() => setLoginMethod('credentials')}
                        >
                            <svg
                                aria-label="Email icon"
                                width="16"
                                height="16"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    fill="none"
                                    stroke="black"
                                >
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            Log in with Email
                        </button>
                        <button
                            type="submit"
                            className="btn bg-white text-black border-[#e5e5e5]"
                            onClick={() => setLoginMethod('google')}
                        >
                            <svg
                                aria-label="Google logo"
                                width="16"
                                height="16"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                            >
                                <g>
                                    <path d="m0 0H512V512H0" fill="#fff"></path>
                                    <path
                                        fill="#34a853"
                                        d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                                    ></path>
                                    <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                                    <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                                    <path
                                        fill="#ea4335"
                                        d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                                    ></path>
                                </g>
                            </svg>
                            Log in with Google
                        </button>
                        <button
                            type="submit"
                            onClick={() => setLoginMethod('microsoft-entra-id')}
                            className="btn bg-[#2F2F2F] text-white border-black"
                        >
                            <svg
                                aria-label="Microsoft logo"
                                width="16"
                                height="16"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                            >
                                <path d="M96 96H247V247H96" fill="#f24f23"></path>
                                <path d="M265 96V247H416V96" fill="#7eba03"></path>
                                <path d="M96 265H247V416H96" fill="#3ca4ef"></path>
                                <path d="M265 265H416V416H265" fill="#f9ba00"></path>
                            </svg>
                            Login with Microsoft
                        </button>
                        <button
                            type="submit"
                            onClick={() => setLoginMethod('github')}
                            className="btn bg-black text-white border-black"
                        >
                            <svg
                                aria-label="GitHub logo"
                                width="16"
                                height="16"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="white"
                                    d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                                ></path>
                            </svg>
                            Login with GitHub
                        </button>
                        {error}
                    </div>
                )}
                {loginMethod === 'credentials' && (
                    <>
                        <label className="fieldset-legend">Log in</label>
                        <label className="fieldset-label justify-between">Email {error}</label>
                        <input className={inputClasses} id="email" name="email" autoComplete="off" onChange={reset} />

                        <label className="fieldset-label">Password</label>
                        <input
                            className={inputClasses}
                            id="password"
                            type="password"
                            name="password"
                            onChange={reset}
                        />

                        <div className="flex flex-col mt-2 gap-2 justify-center">
                            <button type="submit" className="btn w-full" disabled={isPending}>
                                Log in
                            </button>

                            <span className="text-center mt-2">
                                {'No account? '}
                                <Link href="/signup" className="link">
                                    Sign up
                                </Link>
                            </span>

                            <div
                                className="flex items-center justify-center gap-2"
                                onClick={() => {
                                    reset();
                                    setLoginMethod('');
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                                    />
                                </svg>
                                <span className="link link-hover">Use a different log in method</span>
                            </div>
                        </div>
                    </>
                )}
                <input type="hidden" name="redirectTo" value={redirectUrl} />
                <input type="hidden" name="loginMethod" value={loginMethod} />
            </fieldset>
            <div className="text-xs">
                <RecaptchaDisclaimer />
            </div>
        </form>
    );
}
