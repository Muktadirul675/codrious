import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        themeYellow: '#FFDE59',
        themeYellowDark: '#e3c84c',
        themeYellowLight: '#FFF495',
      },
    },
  },
  plugins: [],
};

// module.exports = {
//   theme: {
//     extend: {
//       colors: {
//         customYellow: '#FFDE59',
//         customYellowDark: '#CCB248',
//         customYellowLight: '#FFF495',
//       },
//     },
//   },
//   plugins: [],
// }
export default config;
