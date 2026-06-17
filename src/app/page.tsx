'use client'

import { outfit } from '@/app/ui/font'
import Badge from '@/app/ui/home/badge'

export default function Page() {
  return (
    <div className={`${outfit.className} h-screen w-screen overflow-hidden`}>
      <Badge />
    </div>
  );
}
