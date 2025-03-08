import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", 'html[class~="dark"]'],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#333333',
            strong: {
              color: '#111111',
            },
            h1: {
              color: '#111111',
            },
            h2: {
              color: '#111111',
            },
            h3: {
              color: '#111111',
            },
            h4: {
              color: '#111111',
            },
            p: {
              color: '#333333',
            },
            li: {
              color: '#333333',
            },
            blockquote: {
              color: '#444444',
            },
          },
        },
        invert: {
          css: {
            color: '#e0e0e0',
            strong: {
              color: '#ffffff',
            },
            h1: {
              color: '#ffffff',
            },
            h2: {
              color: '#ffffff',
            },
            h3: {
              color: '#ffffff',
            },
            h4: {
              color: '#ffffff',
            },
            p: {
              color: '#e0e0e0',
            },
            li: {
              color: '#e0e0e0',
            },
            blockquote: {
              color: '#d0d0d0',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
    animate,
  ],
} 