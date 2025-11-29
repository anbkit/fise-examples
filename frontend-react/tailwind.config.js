/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        dark: '#2d3748',
        gray: '#718096',
        light: '#f7fafc',
        border: '#e2e8f0',
        shadow: 'rgba(0, 0, 0, 0.1)',
        // Semantic colors
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        // Background colors
        cardBg: '#f8f9fa',
        warningBg: '#fff3cd',
        infoBg: '#e0f7fa',
        errorBg: '#fee',
        successBg: '#c6f6d5',
        primaryLight: '#bee3f8',
        progressBg: '#f0f0f0',
        // Text colors
        textMuted: '#666',
        textLight: '#999',
        textDark: '#333',
        textMedium: '#555',
        // Border colors
        borderLight: '#dee2e6',
        borderMedium: '#ddd',
        // Code block colors
        codeBg: '#2d2d2d',
        codeText: '#f8f8f2',
        // Gradient colors
        successLight: '#20c997',
        infoLight: '#42a5f5',
        infoDark: '#1976d2',
        primaryDark: '#2c5282',
        successDark: '#22543d',
        errorDark: '#d32f2f',
        primaryLightBg: '#e3f2fd',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
