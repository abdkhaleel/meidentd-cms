import type { Config } from 'tailwindcss';
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#113388',
          secondary: '#113366',
          bright: '#435dd0',
          deep: '#1b4e8c',
          orange: '#ee7000',
          blue: '#0066a6',
        },
        gray: {
          body: '#333333',
          secondary: '#555555',
          muted: '#777777',
          light: '#eeeeee',
          border: '#cccccc',
          hover: '#f2f4f7',
        }
      },
      fontFamily: {
        // Access defaults via defaultTheme.fontFamily
        sans: ["var(--font-body)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-display)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '980px',
          xl: '1280px',
          '2xl': '1280px',
        },
      },
      fontSize: {
        base: ['15px', { lineHeight: '1.75' }],
        lg: ['18px', { lineHeight: '1.75' }],
        xl: ['24px', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;