module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  plugins: [require("tailwind-scrollbar"), require("tw-elements/dist/plugin")],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },
    },
  },
};
