/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      gray: colors.neutral,
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
      sm: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;",
      lg: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
      xl: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;",
      "2xl":
        "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;",
      button: "rgba(66, 40, 0) 4px 4px 0px 0px",
    },
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        beige: "#F9F5EC",
        pink: {
          light: "#F6CBD1",
          DEFAULT: "#F48080",
          dark: "#F0ADB6",
        },
        blue: {
          light: "#70ACC7",
          dark: "#569DBD",
        },
        navy: "#3A4972",
        turquoise: "#3B8EA0",
        kiwi: "#ECF3AB",
        olive: "#888D54",
        green: {
          fluorescent: "#76E694",
          bright: "#0BD674",
        },
        orange: {
          bright: "#FF9500",
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
      },
      animation: {
        marquee: "marquee 13s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  darkMode: "selector",
};
