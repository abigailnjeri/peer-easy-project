/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#202C39",
        terracotta: "#B85C45",
        coral: "#E7A98B",
        cream: "#F4EBDD",
        bluegrey: "#82939D",
      },
    },
  },
  plugins: [],
};
