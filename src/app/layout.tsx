import type { Metadata } from "next";
import { mont} from '@/app/ui/font'
import "./globals.css";
import Menu from "./ui/navigation/menu";



export const metadata: Metadata = {
  title: "helloworld",
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
        <Menu />
        {children}
      </body>
    </html>
  );
}
