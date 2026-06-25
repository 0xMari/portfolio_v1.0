'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [hasScrolled, setHasScrolled] = useState(false)
  const visibleLinks = links.filter((link) => link.href !== pathname)

  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 8)
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    document.addEventListener('scroll', updateScrollState, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScrollState)
      document.removeEventListener('scroll', updateScrollState)
    }
  }, [])

  return (
    <nav
      aria-label='Primary navigation'
      className={`font-mono pointer-events-none fixed left-0 top-0 z-40 flex w-full justify-center px-5 py-5 text-sm font-semibold uppercase tracking-[0.18em] text-black transition-colors duration-300 sm:text-base lg:justify-end ${
        hasScrolled ? 'bg-background' : 'bg-transparent'
      }`}
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
