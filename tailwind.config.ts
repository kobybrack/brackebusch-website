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
                        maxWidth: 'none',
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

                    'primary-content': '#121212',

                    secondary: '#c6c6c6',

                    'secondary-content': '#0e0e0e',

                    accent: '#2563eb',

                    'accent-content': '#d2e2ff',

                    neutral: '#374151',

                    'neutral-content': '#d3d6da',

                    'base-100': '#d1d5db',

                    'base-200': '#b5b9be',

                    'base-300': '#9b9ea2',

                    'base-content': '#101011',

                    info: '#8b5cf6',

                    'info-content': '#070315',

                    success: '#10b981',

                    'success-content': '#000d06',

                    warning: '#facc15',

                    'warning-content': '#150f00',

                    error: '#ef4444',

                    'error-content': '#140202',
                },
            },
        ],
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
} satisfies Config;
