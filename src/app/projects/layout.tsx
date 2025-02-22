'use client'
import NavLinks from "../ui/nav-links";
import { outfit } from "../ui/font";

export const experimental_ppr = true;

 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${outfit.className} flex h-screen flex-col justify-between`}>
        {children}
        
    </div>
  );
}