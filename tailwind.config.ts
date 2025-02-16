import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
        },
    },
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: '#d1d5db',
                    secondary: '#d1d5db',
                    accent: '#60a5fa',
                    neutral: '#374151',
                    'base-100': '#374151',
                    info: '#a78bfa',
                    success: '#86efac',
                    warning: '#fef08a',
                    error: '#ef4444',
                },
            },
        ],
    },
    plugins: [daisyui],
} satisfies Config;
