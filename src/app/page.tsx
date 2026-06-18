'use client'

import { outfit, playFair } from '@/app/ui/font'
import Badge from '@/app/ui/home/badge'

export default function Page() {
  return (
    <main className={`${outfit.className} relative min-h-screen w-screen overflow-x-hidden`}>
      <Badge />
      <section className="flex h-screen w-full items-end justify-center">
        {/* <h1 className='hidden lg:flex'>desktop only</h1> */}
        <div className='flex flex-col w-full lg:hidden z-20 p-10'>
          <h1 className={`${playFair.className} text-xl lg:text-5xl font-semibold text-neutral-900 text-center`}>Let's connect!</h1>
          <div className='flex justify-between w-full'>
            <a href='/'>Linkedin</a>
            <a href='/'>Let's chat</a>
          </div>

        </div>
        
      </section>
      <section className={`${outfit.className} relative z-20 hidden lg:flex lg:flex-col h-screen w-full items-center justify-center`}>
        <h1 className="w-screen whitespace-nowrap text-center text-[clamp(5rem,12vw,18rem)] font-semibold uppercase leading-none text-neutral-900">Let's connect</h1>
        <div className='flex flex-row w-full justify-around pt-10'>
          <div className='text-center'>
            <h3>Shoot me a message here</h3>
            <a className='hover:text-pink-500' href='https://www.linkedin.com/in/maria-jyate/'>Linkedin</a>
          </div>
          <div className='text-center'>
            <h3>Or book a quick chat here</h3>
            <a className='hover:text-pink-500' href='https://calendly.com/0xmari/30min'>Calendly</a>
          </div>
        </div>
        <h2 className='absolute bottom-2 right-2 uppercase text-right'>for everything else check <a className='hover:text-pink-500' href='/about'>about</a> or <a className='hover:text-pink-500' href='/projects'>projects</a></h2>
      </section>
    </main>
  );
}
