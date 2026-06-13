import localFont from "next/font/local";

export const mont = localFont({
  src: "../../../public/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
  display: "swap",
  weight: "100 900",
});

export const playFair = localFont({
  src: [
    {
      path: "../../../public/PlayfairDisplay-Regular.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../../../public/PlayfairDisplay-Italic.ttf",
      style: "italic",
      weight: "400",
    },
  ],
  variable: "--font-play-fair",
  display: "swap",
});

export const outfit = localFont({
  src: "../../../public/Montserrat-VariableFont_wght.ttf",
  variable: "--font-outfit",
  display: "swap",
  weight: "100 900",
});
