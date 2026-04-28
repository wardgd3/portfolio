/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f5f2ed',
          deep: '#ebe7df',
        },
        ink: {
          DEFAULT: '#0e0d0b',
          soft: '#1c1a17',
        },
        stone: {
          50: '#f5f2ed',
          100: '#e8e4dc',
          200: '#d4cec3',
          300: '#b8b0a2',
          400: '#8a8377',
          500: '#5e584f',
          600: '#3f3a33',
        },
        sage: '#7a8270',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        widewide: '0.18em',
        ultrawide: '0.24em',
      },
      borderWidth: {
        hairline: '0.5px',
      },
      maxWidth: {
        'editorial': '1320px',
      },
    },
  },
  plugins: [],
};
