/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./index.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'deep-void': '#080A0F',
                'electric-cyan': '#00F3FF',
                'deep-violet': '#7B2CBF',
            },
            fontFamily: {
                'outfit': ['Outfit', 'sans-serif'],
                'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
