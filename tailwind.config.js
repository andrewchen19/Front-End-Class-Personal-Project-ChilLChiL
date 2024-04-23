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
    },
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        pink: "#F48080",
        blue: {
          light: "#8CBCFF",
          dark: "#3A4972",
        },
        turquoise: "#3B8EA0",
        kiwi: "#ECF3AB",
        green: {
          fluorescent: "#76E694",
          bright: "#0BD674",
        },
        orange: {
          bright: "#FF9500",
        },
        purple: {
          light: "#968095",
          bright: "#6851F4",
        },
        clay: {
          red: "#A04848",
          yellow: "#D0A847",
        },
      },
    },
  },
  plugins: [],
};
