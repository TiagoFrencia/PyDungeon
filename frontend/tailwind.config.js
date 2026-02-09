/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dungeon-dark': '#1a1b26',
                'dungeon-panel': '#24283b',
                'dungeon-accent': '#7aa2f7',
                'dungeon-gold': '#e0af68',
                'dungeon-success': '#9ece6a',
                'dungeon-error': '#f7768e',
            },
        },
    },
    plugins: [],
}
