import type { Config } from "tailwindcss";

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Secondary Color Scheme
        secondary: '#4B9CD3', // A lighter, secondary blue

        snow: '#F0F8FF', // Snow color for text

        // Muted Colors for backgrounds, borders, placeholders, etc.
        muted: '#F0F4F8', // Very light grey/blue

        // Additional Utility Colors
        success: '#48BB78', // Green for success states
        warning: '#ED8936', // Orange for warning states
        info: '#4299E1', // Blue for informational messages

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
        primary: {
          // Primary blue shades; used for primary buttons, links, and accents
          DEFAULT: '#00254A', // Deep navy blue as the primary color
          80: 'rgba(0, 37, 74, 0.8)',
          60: 'rgba(0, 37, 74, 0.6)',
          40: 'rgba(0, 37, 74, 0.4)',
          20: 'rgba(0, 37, 74, 0.2)',
          10: 'rgba(0, 37, 74, 0.1)',
        },
        skyWave: {
          // Secondary blue shades; used for secondary elements and backgrounds
          DEFAULT: '#4B9CD3',
          80: 'rgba(75, 156, 211, 0.8)',
          60: 'rgba(75, 156, 211, 0.6)',
          40: 'rgba(75, 156, 211, 0.4)',
          20: 'rgba(75, 156, 211, 0.2)',
          10: 'rgba(75, 156, 211, 0.1)',
        },
        sunrise: {
          // Accent amber/yellow shades; used for call-to-action elements and alerts
          DEFAULT: '#FFC107',
          80: 'rgba(255, 193, 7, 0.8)',
          60: 'rgba(255, 193, 7, 0.6)',
          40: 'rgba(255, 193, 7, 0.4)',
          20: 'rgba(255, 193, 7, 0.2)',
          10: 'rgba(255, 193, 7, 0.1)',
        },
        ashGray: {
          // Muted gray shades; used for backgrounds, borders, placeholders, etc.
          DEFAULT: '#F0F4F8',
          80: 'rgba(240, 244, 248, 0.8)',
          60: 'rgba(240, 244, 248, 0.6)',
          40: 'rgba(240, 244, 248, 0.4)',
          20: 'rgba(240, 244, 248, 0.2)',
          10: 'rgba(240, 244, 248, 0.1)',
        },
        destructive: {
          // Destructive red shades; used for errors or destructive actions
          DEFAULT: '#E53E3E',
          80: 'rgba(229, 62, 62, 0.8)',
          60: 'rgba(229, 62, 62, 0.6)',
          40: 'rgba(229, 62, 62, 0.4)',
          20: 'rgba(229, 62, 62, 0.2)',
          10: 'rgba(229, 62, 62, 0.1)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
