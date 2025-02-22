import { Montserrat, Playfair_Display, Outfit} from "next/font/google";

export const mont = Montserrat({
    variable: "--font-montserrat",
    display: 'swap',
    subsets: ["latin"],
});
  
export const playFair = Playfair_Display({
    variable: "--font-play-fair",
    display: 'swap',
    subsets: ["latin"],
});

export const outfit = Outfit({
    variable: "--font-outfit",
    display: 'swap',
    subsets: ["latin"],
});