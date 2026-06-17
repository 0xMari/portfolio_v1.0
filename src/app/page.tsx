'use client'

import { outfit } from '@/app/ui/font'
import Badge from '@/app/ui/home/badge'

export default function Page() {
  return (
    <main className={`${outfit.className} relative min-h-[200vh] w-screen overflow-x-hidden`}>
      <Badge />
      <section className="flex h-screen items-center justify-center">
        <h1 className="text-5xl font-semibold text-neutral-900">1st page</h1>
      </section>
      <section className="flex h-screen items-center justify-center">
        <h1 className="text-5xl font-semibold text-neutral-900">2nd page</h1>
      </section>
    </main>
  );
}
