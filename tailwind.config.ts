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
                        maxWidth: '100ch', // add required value here
                    },
                },
            },
        },
    },
    daisyui: {
        themes: [
            {
                mytheme:
                    // {
                    //     primary: '#2d3748', // Lighter dark gray
                    //     secondary: '#4a5568', // Medium gray
                    //     accent: '#a0aec0', // Soft gray-blue for subtle accents
                    //     neutral: '#cbd5e0', // Light gray for neutral elements
                    //     'base-100': '#1a202c', // Dark gray for the background
                    //     info: '#a0aec0', // Muted gray-blue for info highlights
                    //     success: '#68d391', // Softer green for success messages
                    //     warning: '#f6e05e', // Lighter yellow for warnings
                    //     error: '#fc8181', // Softer red for errors
                    // },

                    {
                        primary: '#e5e5e5', // A slightly darker light gray
                        secondary: '#c6c6c6', // A medium light gray
                        accent: '#2563eb', // A darker shade of blue
                        neutral: '#374151', // A deeper neutral gray
                        'base-100': '#d1d5db', // A bit darker gray
                        info: '#8b5cf6', // A deeper lavender
                        success: '#10b981', // A slightly darker green
                        warning: '#facc15', // A more golden yellow
                        error: '#ef4444', // A stronger red
                    },

                // {
                //     "primary": "#f5f5f4",
                //     "primary-content": "#151514",
                //     "secondary": "#d6d3d1",
                //     "secondary-content": "#101010",
                //     "accent": "#60a5fa",
                //     "accent-content": "#030a15",
                //     "neutral": "#6b7280",
                //     "neutral-content": "#e0e1e4",
                //     "base-100": "#9ca3af",
                //     "base-200": "#878d98",
                //     "base-300": "#737881",
                //     "base-content": "#090a0b",
                //     "info": "#c4b5fd",
                //     "info-content": "#0e0c16",
                //     "success": "#bbf7d0",
                //     "success-content": "#0d1510",
                //     "warning": "#fef3c7",
                //     "warning-content": "#16140e",
                //     "error": "#fca5a5",
                //     "error-content": "#160a0a",
                //               },
            },
        ],
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
} satisfies Config;
