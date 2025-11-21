import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Derived from your CSS analysis
        brand: {
          primary: '#113388',   // .blue-title, .active-nav, headings
          secondary: '#113366', // .sitesearch-button, .pages-sidebar-header
          bright: '#435dd0',    // .top-navbar border
          deep: '#1b4e8c',      // Hover states
          orange: '#ee7000',    // .news-release-notice-orange
          blue: '#0066a6',      // .news-release-notice-blue
        },
        gray: {
          body: '#333333',      // Default text
          secondary: '#555555', // Nav links
          muted: '#777777',     // Breadcrumbs
          light: '#eeeeee',     // Backgrounds/Inputs
          border: '#cccccc',    // Borders
          hover: '#f2f4f7',     // Row hovers
        }
      },
      fontFamily: {
        // Matches body { font-family: Verdana, Arial, sans-serif; }
        sans: ['Verdana', 'Arial', 'sans-serif'],
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
          lg: '980px',  // Matches your original .container max-width
          xl: '1280px', // Matches your .slider-container max-width
          '2xl': '1280px', // Cap max width to prevent it getting too stretched
        },
      },
      // Modernizing the "15px" requirement by extending spacing slightly
      fontSize: {
        base: ['15px', { lineHeight: '1.75' }], // Your specific base requirements
        lg: ['18px', { lineHeight: '1.75' }],
        xl: ['24px', { lineHeight: '1.5' }],    // For sub-page titles
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;