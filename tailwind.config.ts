import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171316',
        punch: '#ff3d64',
        sun: '#ffd447',
        pool: '#2fd3d6',
        paper: '#fffaf0',
      },
      boxShadow: {
        stage: '0 24px 0 #171316',
      },
    },
  },
  plugins: [],
} satisfies Config;
