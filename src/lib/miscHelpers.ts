import { ALL_ROLES } from '@/lib/constants';

export function generateUsername(email: string) {
    const namePart = email.split('@')[0];
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const username = `${namePart}${randomNumber}`;
    return username;
}

export function getEffectiveRoles(userRoles: string[]) {
    if (userRoles.includes('admin')) {
        return ALL_ROLES;
    }
    return userRoles;
}
