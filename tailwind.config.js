/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      colors: {
        tree_green: "#1AA873",
        gray: {
          1: "#F4F4F4",
          2: "#EDEDED",
          3: "#DEDEDE",
          4: "#CCCCCC",
          5: "#AEAEAE",
          6: "#8D8D8D",
          7: "#6B6B6B",
          8: "#4A4A4A",
          9: "#2D2D2D",
          black: "#0E0E0E",
          white: "#FDFDFD",
        },
      },
      fontSize: {
        head1: ["44px", "60px"],
        head2: ["28px", "50px"],
        body1: ["24px", "40px"],
        caption1: ["18px", "26px"],
      },
      fontWeight: {
        head1: "bold", // head_44_B
        head2: "semibold", // head_28_SB
        body1: "medium", // body_24_M
        caption1: "medium", // caption_18_M
      },
    },
  },
  plugins: [],
};
