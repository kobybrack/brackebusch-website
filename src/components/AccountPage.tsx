'use client';

import { useState } from 'react';
import { User } from '@/lib/types';
import { updateUser } from '@/lib/actions';
import useResettableActionState from '@/hooks/useResettableActionState';
import { useSession } from 'next-auth/react';

export default function AccountClientComponent({ initialUser }: { initialUser: User }) {
    const [user, setUser] = useState(initialUser);
    const { update } = useSession();

    const updateUserAction = async (_: any, formData: any) => {
        const updateUserBody = {
            email: formData.get('email'),
            username: formData.get('username'),
            firstName: formData.get('first_name'),
            lastName: formData.get('last_name'),
            userPreferences: {
                postNotifications: formData.get('post_notifications') === 'on',
                missionNotifications: formData.get('mission_notifications') === 'on',
            },
            roleCode: formData.get('role_code'),
        };
        setUser((prevUser) => ({
            ...prevUser,
            ...updateUserBody,
        }));
        try {
            const updatedUser = await updateUser(updateUserBody);
            if (updatedUser.roleAdded) {
                await update('sync roles'); // dummy text
                window.location.reload();
            }
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
            return 'Something went wrong :(';
        }
        return null;
    };

    const [error, formAction, isSubmitting, reset] = useResettableActionState(updateUserAction, null);

    return (
        <div className="flex flex-col justify-center max-w-(--breakpoint-md) mx-auto gap-8">
            <form className="" action={formAction}>
                <fieldset className="fieldset border-base-300 rounded-box w-full border p-4 flex flex-col sm:grid sm:grid-cols-2 gap-y-2 gap-x-4">
                    <label className="fieldset-legend col-span-2">
                        <p>Account settings</p>
                        <p className="text-error w-1/2">{error}</p>
                    </label>
                    <div className="flex flex-col gap-1">
                        <label className="label">Email</label>
                        <input type="text" className="input w-full" disabled value={user.email} />
                        <input name="email" type="hidden" defaultValue={user.email} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="label">Username </label>
                        <div className="tooltip" data-tip="This isn't used anywhere yet">
                            <input
                                name="username"
                                type="text"
                                className="input w-full"
                                onChange={reset}
                                defaultValue={user.username}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="label">First name</label>
                        <input
                            name="first_name"
                            type="text"
                            className="input w-full"
                            onChange={reset}
                            defaultValue={user.firstName}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="label">Last name</label>
                        <input
                            name="last_name"
                            type="text"
                            className="input w-full"
                            onChange={reset}
                            defaultValue={user.lastName}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex flex-col gap-1 col-span-1">
                        <label className="label">Have an access code?</label>
                        <input name="role_code" type="text" className="input w-full" autoComplete="off" />
                    </div>
                    <div className="flex flex-col justify-center gap-2 col-span-1">
                        <label className="label" />
                        <label className="label ">
                            <input
                                name="post_notifications"
                                type="checkbox"
                                className="checkbox"
                                defaultChecked={user.userPreferences?.postNotifications}
                            />
                            <p>Email me when there's a new post</p>
                        </label>
                        {user.roles?.includes('missions') && (
                            <label className="label">
                                <input
                                    name="mission_notifications"
                                    type="checkbox"
                                    className="checkbox"
                                    defaultChecked={user.userPreferences?.missionNotifications}
                                />
                                <p>
                                    Email me when there's a new <em>mission</em> post
                                </p>
                            </label>
                        )}
                    </div>
                    <button type="submit" className="btn mt-2 max-w-1/2" disabled={isSubmitting}>
                        Save
                    </button>
                </fieldset>
            </form>
        </div>
    );
}
