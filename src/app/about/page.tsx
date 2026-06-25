'use client'
import { outfit } from '@/app/ui/font'
import { CalendarDaysIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function Page() {
  const recordRows = [
    ['File number', '260619F2303P02M'],
    ['Purpose record', 'GG0403WP'],
    ['SRU ID', 'MXA-027'],
  ]

  const infoRows = [
    ['name', 'maria'],
    ['status', 'available'],
    ['role', 'technical PM / software engineer'],
    ['base', 'milan'],
    ['mbti', 'intp'],
  ]

  return (
    <main className={`${outfit.className} min-h-screen w-full bg-[#f4f4f2] px-5 py-14 text-black sm:px-8 lg:px-12`}>
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex justify-end">
          <dl className="border-t-[6px] border-black font-mono text-sm uppercase leading-tight tracking-[0.04em] sm:text-base">
            {recordRows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[1fr_auto] gap-6 border-b border-black py-1"
              >
                <dt>{label}</dt>
                <dd className="text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className='mx-auto w-full max-w-6xl border border-black pt-10'>
        <div className='flex flex-col gap-10 lg:flex-row lg:justify-between'>
          <div className='flex min-w-0 flex-col lg:max-w-[58%]'>
            <dl className="font-mono text-sm uppercase leading-tight tracking-[0.04em] sm:text-base">
              {infoRows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 border-b border-black py-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className='font-bold'>{label}:</dt>
                  <dd className="min-w-0 text-left">{value}</dd>
                </div>
              ))}
            </dl>
            <div className='pt-10 font-mono text-sm uppercase leading-tight tracking-[0.04em] sm:text-base'>
              <p className='font-bold'>Profile</p>
              <p>Currently working on digital payment products in the fintech space. Outside of work, I focus on front-end development, creative coding, and interactive experiences.</p>
            </div>
            <div className='flex flex-col gap-8 pt-10 font-mono text-sm uppercase leading-tight tracking-[0.04em] sm:text-base md:flex-row md:justify-between'>
              <div>
                <p className='font-bold'>Subjects of interest</p>
                <p>
                  AI workspaces & agents<br/>
                  Procedural generation<br/>
                  Interactive storytelling<br/>
                  My next vacation spot
                </p>
              </div>
              <div>
                <p className='font-bold'>Faves</p>
                <p>
                  an unreasonable skincare routine<br/>
                  Ro-fan manhwa<br/>
                  TTRPG<br/>
                  good food
                </p>
              </div>
            </div>
          </div>
          <div className='min-h-48 w-full border border-blue-500 lg:w-[36%]'>
            <img src='/imgs/IMG_7921.png'/>
          </div>
        </div>
      </section>
      <section className='mx-auto w-full max-w-6xl border border-black'>
        <div className='flex w-full justify-end gap-4'>
          <a
            href='https://github.com/0xMari'
            aria-label='GitHub'
            target='_blank'
            rel='noreferrer'
            className='grid size-9 place-items-center hover:text-pink-500'
          >
            <GitHubIcon className='size-6' />
          </a>
          <a
            href='https://www.linkedin.com/in/maria-jyate/'
            aria-label='LinkedIn'
            target='_blank'
            rel='noreferrer'
            className='grid size-9 place-items-center hover:text-pink-500'
          >
            <LinkedInIcon className='size-6' />
          </a>
          <a
            href='https://calendly.com/0xmari/30min'
            aria-label='Calendly'
            target='_blank'
            rel='noreferrer'
            className='grid size-9 place-items-center hover:text-pink-500'
          >
            <CalendarDaysIcon className='size-6' />
          </a>
          <a
            href='mailto:maria.jyate@gmail.com'
            aria-label='Email'
            className='grid size-9 place-items-center hover:text-pink-500'
          >
            <EnvelopeIcon className='size-6' />
          </a>
        </div>
      </section>
    </main>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d='M12 2C6.48 2 2 6.58 2 12.25c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.51.47-3.16-.63-3.36-1.21-.11-.3-.6-1.21-1.03-1.46-.35-.19-.85-.66-.01-.67.79-.01 1.35.74 1.54 1.05.9 1.55 2.34 1.11 2.91.85.09-.67.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.96c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.06.36.32.68.93.68 1.88 0 1.36-.01 2.45-.01 2.79 0 .27.18.59.69.49A10.08 10.08 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z' />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d='M6.94 8.98H3.56V20h3.38V8.98ZM7.2 5.58C7.2 4.52 6.35 3.7 5.25 3.7c-1.09 0-1.95.82-1.95 1.88 0 1.05.86 1.88 1.95 1.88 1.1 0 1.95-.83 1.95-1.88ZM20.7 13.68c0-3.32-1.77-4.86-4.13-4.86-1.9 0-2.75 1.05-3.23 1.79V8.98H9.98c.04 1.03 0 11.02 0 11.02h3.36v-6.15c0-.33.03-.66.12-.9.27-.66.87-1.34 1.88-1.34 1.33 0 1.86 1.01 1.86 2.49V20h3.36l.14-6.32Z' />
    </svg>
  )
}
