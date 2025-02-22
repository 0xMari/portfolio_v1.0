import Link from "next/link";
import { usePathname } from "next/navigation";
import { mont } from "./font";
import clsx from "clsx";

const links = [
    {
        name: 'Home',
        href: '/',
      },
    {
      name: 'About',
      href: '/about',
    },
    { 
        name: 'Projects', 
        href: '/projects',
    },
    {
        name: 'Demo',
        href: '/demo',
      },
  ];
  

export default function NavLinks(){
    const pathname = usePathname()
    return(
        <>
        {links.map((link)=>{
            
            return(
                <Link
                    key={link.name}
                    href={link.href}
                    className={clsx 
                        (`${mont.className} text-foreground lowercase border border-foreground px-8 py-2 rounded-[60%] hover:text-pink-500`,
                        {
                            'text-pink-500 border-pink-500': pathname === link.href,
                        },
                        )}>
                        <p>{link.name}</p>
                </Link>

            )
        })}
        </>
    )
}