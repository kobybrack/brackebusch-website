import type { Config } from 'tailwindcss';

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '75ch',
                    },
                },
            },
        },
    },
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: '#e5e5e5',
                    secondary: '#c6c6c6',
                    accent: '#2563eb',
                    neutral: '#374151',
                    'base-100': '#d1d5db',
                    info: '#8b5cf6',
                    success: '#10b981',
                    warning: '#facc15',
                    error: '#ef4444',
                },
            },
        ],
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
} satisfies Config;
