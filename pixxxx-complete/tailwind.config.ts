import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        coral: { DEFAULT: '#D85A30', dark: '#B8471F', light: '#F0997B' },
        amber: '#EF9F27',
        pixxxx: {
          black: '#0A0A08',
          dark: '#141412',
          card: '#1C1C1A',
          text: '#F0EDE8',
          muted: '#888780',
          border: 'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: { xl: '14px', '2xl': '20px' },
    },
  },
  plugins: [],
}

export default config
