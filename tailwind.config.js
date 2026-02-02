/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#6366f1",
                accent: "#10b981",
                dark: "#0a0a0c",
                card: "rgba(20, 20, 25, 0.7)",
                dim: "#94a3b8",
                main: "#e2e8f0",
            },
        },
    },
    plugins: [],
}
