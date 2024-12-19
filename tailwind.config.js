/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "#D9E2EC", customGrey: "#F0F4F8", customGray: "#FAFAFA", DarkerGray: "#929AAB",
      },
    },
  },
  plugins: [],
};
