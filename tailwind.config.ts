import type { Config } from 'tailwindcss';

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
                    primary: '#f5f5f4',
                    secondary: '#d6d3d1',
                    accent: '#60a5fa',
                    neutral: '#6b7280',
                    'base-100': '#9ca3af',
                    info: '#c4b5fd',
                    success: '#bbf7d0',
                    warning: '#fef3c7',
                    error: '#fca5a5',
                },
            },
        ],
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
} satisfies Config;
