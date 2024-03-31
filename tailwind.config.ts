import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Color Scheme
        primary: '#00254A', // Deep navy blue as the primary color
        'primary-light': '#334E68', // A lighter shade of the primary color for hover states, etc.
        'primary-dark': '#001D3D', // A darker shade of the primary color for active states, etc.

        // Secondary Color Scheme
        secondary: '#4B9CD3', // A lighter, secondary blue
        'secondary-light': '#BCCCDC', // A much lighter shade of the secondary color
        'secondary-dark': '#3C8DAD', // A darker shade of the secondary color

        // Accent Colors for Call-to-Action elements, alerts, etc.
        accent: '#FFC107', // Amber
        'accent-light': '#FFD54F', // Lighter amber
        'accent-dark': '#FFA000', // Darker amber

        // Muted Colors for backgrounds, borders, placeholders, etc.
        muted: '#F0F4F8', // Very light grey/blue
        'muted-light': '#F9FAFB', // Lighter grey for elevated surfaces in light mode
        'muted-dark': '#D1D5DB', // Darker grey for elevated surfaces in dark mode

        // Destructive Colors for errors or destructive actions
        destructive: '#E53E3E', // Red
        'destructive-light': '#FEB2B2', // Lighter red
        'destructive-dark': '#C53030', // Darker red

        // Additional Utility Colors
        success: '#48BB78', // Green for success states
        warning: '#ED8936', // Orange for warning states
        info: '#4299E1', // Blue for informational messages

        // Neutral Palette for text, backgrounds, borders, etc.
        black: '#000', // Pure black
        white: '#fff', // Pure white
        grey: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        // Add or adjust as needed to match your design guide
      },
    },
  },
  plugins: [],
} satisfies Config;
