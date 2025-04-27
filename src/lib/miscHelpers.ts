import { ALL_ROLES, SECONDS_MAP } from '@/lib/constants';

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

export function timeAgo(dateString: string) {
    const diff = Math.floor((Date.now() - Date.parse(dateString)) / 1000);

    if (diff < SECONDS_MAP.minute) {
        return `just now`;
    } else if (diff < SECONDS_MAP.hour) {
        const minutes = Math.floor(diff / SECONDS_MAP.minute);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diff < SECONDS_MAP.day) {
        const hours = Math.floor(diff / SECONDS_MAP.hour);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diff < SECONDS_MAP.week) {
        const days = Math.floor(diff / SECONDS_MAP.day);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (diff < SECONDS_MAP.year) {
        const weeks = Math.floor(diff / SECONDS_MAP.week);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diff / SECONDS_MAP.year);
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
}
