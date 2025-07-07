/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'plus-jakarta-sans': ['var(--font-plus-jakarta-sans)', 'sans-serif'],
        'noto-sans': ['var(--font-noto-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
