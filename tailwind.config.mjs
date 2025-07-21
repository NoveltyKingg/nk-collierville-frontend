import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#385f43",
        footer: "#f3dbc3",
        footerText: "#341809",
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        "nk-theme": {
          // This theme is used in your _app.js
          extend: "light",
          colors: {
            // New Primary Color (Orange)
            primary: {
              50: "#fff5ee",
              100: "#ffe3d0",
              200: "#ffceb0",
              300: "#ffb990",
              400: "#ffa470",
              500: "#ff8540",
              DEFAULT: "#ff8540", // Your main primary color
              foreground: "#ffffff", // White text on the orange background
            },
            // New Secondary Color (Green)
            secondary: {
              50: "#eaf0ec",
              100: "#cddbd2",
              200: "#b1c7b9",
              300: "#94b29f",
              400: "#789e86",
              500: "#5b896c",
              600: "#446d56",
              700: "#385f43",
              DEFAULT: "#385f43", // Your main secondary color
              foreground: "#ffffff",
            },
            // Background and Text Colors
            background: "#f3dbc3", // Main background from the third color
            foreground: "#385f43", // Main text color (dark green for contrast)

            // Other important colors
            focus: "#ff8540", // Use the primary orange for focus rings
            content1: "#fefbf8", // A slightly lighter color for cards/modals

            // Standard semantic colors
            danger: {
              DEFAULT: "#e53e3e",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#38a169",
              foreground: "#ffffff",
            },
            warning: {
              DEFAULT: "#dd6b20",
              foreground: "#ffffff",
            },
          },
          layout: {
            radius: {
              small: "4px",
              medium: "8px",
              large: "12px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),
  ],
};

export default config;
