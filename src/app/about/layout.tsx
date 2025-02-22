'use client'
export const experimental_ppr = true;

 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col justify-between text-foreground">
        {children}
    </div>
  );
}