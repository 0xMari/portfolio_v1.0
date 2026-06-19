'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mont } from '@/app/ui/font'

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
]

export default function Navbar() {
  const pathname = usePathname()
  const visibleLinks = links.filter((link) => link.href !== pathname)

  return (
    <nav
      aria-label='Primary navigation'
      className={`font-mono pointer-events-none fixed left-0 top-0 z-40 flex w-full justify-center lg:justify-end px-5 py-5 text-sm font-semibold uppercase tracking-[0.18em] text-black sm:text-base`}
    >
      <div className='pointer-events-auto flex gap-5 sm:gap-8'>
        {visibleLinks.map((link) => (
          <Link key={link.href} href={link.href} className='hover:text-pink-500'>
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}
