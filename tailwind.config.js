/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      height: {
        '18': '4.5rem',
      },
      spacing: {
        '18': '4.5rem',
      },
      colors: {
        // Remove custom color definitions since we're using Tailwind's built-in colors
      },
    },
  },
  plugins: [],
} 