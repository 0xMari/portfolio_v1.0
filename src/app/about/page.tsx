'use client'
import { outfit, playFair } from '@/app/ui/font'
import { ArrowDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Flower from '../ui/about/flower'
import Blobs from '../ui/about/blobs'
import Wire from '../ui/about/wireframe'
import { PillMarkSvg } from '../ui/about/lines'

export default function Page() {
    return(
      <div className={`w-screen h-full grid grid-cols-2 lg:grid-cols-6 grid-rows-7 lg:grid-rows-6 gap-3 p-8 ${outfit.className}`}>
        <div className=' hidden lg:block lg:row-start-1 lg:row-span-2 lg:rounded-[999px]'>
          <Flower/>
        </div>
        <div className=' col-span-2 lg:col-start-2 lg:col-span-2 row-span-1 lg:row-span-1 '>
          <PillMarkSvg/>
        </div>
        <div className='border border-black hidden lg:block lg:col-start-4 lg:col-span-2 lg:row-start-1 lg:row-span-2 lg:rounded-[999px_999px_0_0]'>
          <img src='/imgs/transStar.png' alt='' className='w-[120%] h-auto object-fill'/>
        </div>
        <div className='border border-black hidden lg:block lg:row-start-1 lg:row-span-6 lg:rounded-[999px]'><Blobs/></div>
        <div className='border border-black hidden overflow-hidden lg:block lg:row-start-3 lg:row-span-4 lg:rounded-[999px]'>
          <Wire/>
        </div>
        <div className='border border-black col-span-2 lg:col-start-2 lg:col-span-2 row-span-3 lg:row-start-2 lg:row-span-3 rounded-[15px_15px_15px_15px]'>
          <div className='p-4 lg:p-8 text-sm'>
          <span className={`${playFair.className} lg:text-3xl/10`}>Hi, I'm Maria</span><br/>
          <p className='lg:text-xl/7 text-justify'>
          I currently work in fintech building online payment systems (it pays for my travelling adventures).<br/>
          Outside of work i like to experiment with creative development and immersive experiences, at least when I am not out and about with my friends.
          </p></div>
        </div>
        <div className='border border-black col-span-1 lg:col-start-4 lg:col-span-2 lg:row-start-3 row-span-3 lg:row-span-2 rounded-[15px_15px_15px_15px]'>
          <div className='lg:text-left p-1 lg:p-10 text-sm lg:text-xl/6'>
            <span className={`${playFair.className} lg:text-2xl`}>Currently exploring</span><br/>
            ✷ AI workspaces & agents<br/>
            ✷ Procedural generation<br/>
            ✷ Interactive storytelling<br/>
            ✷ My next vacation spot
          </div>
        </div>
        <div className='border border-black col-span-1 lg:col-start-2 lg:col-span-2 lg:row-start-5 row-span-3 lg:row-span-2  rounded-[15px_15px_15px_15px] lg:rounded-[0_0_0_999px]'>
          <div className='lg:text-left p-1 lg:p-10 text-sm lg:text-xl/6'><p>
            <span className={`${playFair.className} lg:text-xl`}>Things I enjoy:</span><br/>
            <span className='lg:pl-[clamp(0.50rem,2vw,0.75rem)]'>✷ an unreasonable skincare routine</span><br/>
            <span className='lg:pl-[clamp(1rem,2.5vw,1.75rem)]'>✷  Ro-fan manhwa</span><br/>
            <span className='lg:pl-[clamp(1.75rem,4vw,3rem)]'>✷  glitter</span><br/>
            <span className='lg:pl-[clamp(2.75rem,5.5vw,4.50rem)]'>✷  TTRPG</span><br/>
            <span className='lg:pl-[clamp(3.75rem,7vw,6.25rem)]'>✷  good food</span>
          </p></div>
        </div>
        <div className='border border-black col-span-2 lg:col-start-4 lg:col-span-2 lg:row-start-5 row-span-1 lg:row-span-2 rounded-[0_0_30px_30px]'>
          <div className='pt-20 pb-20'>
            <p className={`${playFair.className} lg:text-2xl text-center`}>Elsewhere</p><br/>
            <div className='flex flex-row justify-around'>
              <a>github</a>
              <a>linkedin</a>
              <a>cv</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
