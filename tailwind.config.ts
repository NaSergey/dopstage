import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

const config = {
    darkMode: 'selector',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                gray: {
                    ...colors.gray,
                    '750': '#374151',
                },
            },
            fontFamily: {
                mono: ['var(--font-mono)', 'monospace'],
                sans: ['var(--font-sans)', 'sans-serif'],
            },
            fontSize: {
                '5xl': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1', fontWeight: '800' }], // 32px - 48px, line-height: 32px - 48px
                '4xl': ['clamp(1.75rem, 4vw, 2.25rem)', { lineHeight: '1.1', fontWeight: '800' }], // 28px - 36px, line-height: 31px - 40px
                '3xl': ['clamp(1.5rem, 3vw, 1.875rem)', { lineHeight: '1.2', fontWeight: '600' }], // 24px - 30px, line-height: 29px - 36px
                '2xl': ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.33', fontWeight: '600' }], // 20px - 24px, line-height: 27px - 32px
                'xl': ['clamp(1.125rem, 2vw, 1.25rem)',  { lineHeight: '1.4', fontWeight: '600' }], // 18px - 20px, line-height: 25px - 28px
                'lg': ['clamp(1rem, 1.5vw, 1.125rem)',  { lineHeight: '1.55', fontWeight: '600' }], // 16px - 18px, line-height: 25px - 28px
                'base': ['clamp(0.875rem, 1.25vw, 1rem)',{ lineHeight: '1.5', fontWeight: '400' }], // 14px - 16px, line-height: 21px - 24px
                'sm': ['clamp(0.75rem, 1vw, 0.875rem)',  { lineHeight: '1.42', fontWeight: '400' }], // 12px - 14px, line-height: 17px - 20px
                'xs': ['clamp(0.625rem, 0.85vw, 0.6875rem)', { lineHeight: '1.6', fontWeight: '400' }], // 10px - 11px, line-height: 16px - 18px
            },
            fontWeight: {
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '800',
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
} satisfies Config

export default config
