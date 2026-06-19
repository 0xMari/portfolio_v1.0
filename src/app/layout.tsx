import type { Metadata } from "next";
import { mont} from '@/app/ui/font'
import "./globals.css";
import Navbar from "./ui/navbar/navbar";
import Loader from "./ui/loader";



export const metadata: Metadata = {
  title: "mrajyt",
  description: "portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mont.variable} antialiased`}
        id='circularcursor'
        suppressHydrationWarning
      >
        <Navbar />
        <Loader />
        {children}
      </body>
    </html>
  );
}
