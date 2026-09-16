import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sola: {
          orange: '#ff7139',
          'orange-soft': '#fff1e9',
          'orange-hover': '#f05e24',
          navy: '#111938',
          'navy-muted': '#2d3658',
          'text-secondary': '#73778a',
          green: '#27b47e',
          'green-soft': '#eaf8f2',
          blue: '#4c8df6',
          'blue-soft': '#eef4fe',
          purple: '#8b5cf6',
          'purple-soft': '#f4f0ff',
          yellow: '#f7ab29',
          'yellow-soft': '#fef7ea',
          red: '#ed646f',
          'red-soft': '#fdebed',
          bg: '#fffdf9',
          surface: '#ffffff',
          border: '#f0ede6',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '28px',
      },
      boxShadow: {
        'sola-soft': '0 4px 20px -2px rgba(17, 25, 56, 0.05)',
        'sola-card': '0 2px 12px -2px rgba(17, 25, 56, 0.04)',
        'sola-hover': '0 8px 24px -4px rgba(255, 113, 57, 0.12)',
        'sola-highlight': '0 0 0 2px #ff7139',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        handwriting: ['Caveat', 'Comic Sans MS', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;

