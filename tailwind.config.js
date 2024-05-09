/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      gray: colors.gray,
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1280px",
    },
    fontFamily: {
      notosans: ["Noto Sans TC", "sans-serif"],
      helvetica: ["Helvetica", "sans-serif"],
      fashioncountry: ["FashionCountry", "sans-serif"],
      superglue: ["SuperGlue", "sans-serif"],
      dripoctober: ["DripOctober", "sans-serif"],
      palanquin: ["Palanquin", "sans-serif"],
      sriracha: ["Sriracha", "sans-serif"],
      veneer: ["Veneer", "sans-serif"],
    },
    boxShadow: {
      xs: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);",
      sm: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;",
      lg: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
      xl: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;",
      "2xl":
        "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;",
      button: "rgba(66, 40, 0) 4px 4px 0px 0px",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        black: "#000000",
        white: "#FFFFFF",
        beige: "#F9F5EC",
        pink: {
          light: "#f2b5bd",
          DEFAULT: "#F48080",
          dark: "#F0ADB6",
          red: "#D2003C",
        },
        blue: {
          light: "#67a7c4",
          dark: "#569DBD",
        },
        navy: "#3A4972",
        turquoise: "#3B8EA0",
        kiwi: "#ECF3AB",
        olive: "#888D54",
        green: {
          fluorescent: "#76E694",
          DEFAULT: "#0F4C3A",
          bright: "#0BD674",
        },
        orange: {
          DEFAULT: "#e68600",
          bright: "#ff9500",
        },
        carrot: "#FF4742",
        purple: {
          light: "#968095",
          bright: "#6851F4",
        },
        clay: {
          red: "#A04848",
          yellow: "#D0A847",
        },
        yellow: {
          light: "#F8CA86",
          DEFAULT: "#fbbf24",
        },
        red: "#FF465A",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 13s linear infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
  darkMode: "selector",
};
