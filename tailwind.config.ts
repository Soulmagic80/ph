import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        "geist-sans": ["var(--font-geist-sans)"],
        "geist-mono": ["var(--font-geist-mono)"],
        "courier-prime": ["var(--font-courier-prime)"],
      },
      colors: {
        suoerdark: { 999: "#090E1A" },
        gray: { 
          750: "#2d3748",  // Hover States (zwischen 700 und 800)
          850: "#171f2e",  // Cards/Containers (zwischen 800 und 900)
          925: "#0c1118",  // Optional: Sehr dunkle Elemente (zwischen 900 und 950)
          950: "#0a0f1a"   // Custom override (heller als Standard #030712)
        },
        blue: {
          primary: "#0084FF",  // Primary blue for CTAs, links, accents
          /*primary: "#3474DB",  // Primary blue for CTAs, links, accents*/
        },
        warmgrey: { 100: "#9C9C9C" },
        warmwhite: { 100: "#FCFCF9" },  // Phantom-style warm off-white
        lightbeige: { 100: "#FBFAF9" },
        /*lightbeige: { 100: "#FFFFFF" },*/
        midbeige: { 200: "#F5F2F0" },
        beige: { 300: "#EBE5DF" },
        supergrey: { 100: "#1F3147" },
        pink: { 100: "#FF006A" },
        pinkdark: { 200: "#E32976" },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
          md: '2.5rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      keyframes: {
        accordionOpen: {
          from: { height: "0px" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        accordionClose: {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: { height: "0px" },
        },
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        dialogOverlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        dialogContentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -45%) scale(0.95)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        drawerSlideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        drawerSlideRightAndFade: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(100%)" },
        },
        revealBottom: {
          from: {
            opacity: "0",
            transform: "translateY(12px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
      },
      animation: {
        accordionOpen: "accordionOpen 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        accordionClose: "accordionClose 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        hide: "hide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade:
          "slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        drawerSlideLeftAndFade:
          "drawerSlideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        drawerSlideRightAndFade: "drawerSlideRightAndFade 150ms ease-in",
        dialogOverlayShow:
          "dialogOverlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogContentShow:
          "dialogContentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        revealBottom: "revealBottom ease-in-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
export default config
