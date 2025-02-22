'use client'
import { outfit, playFair } from '@/app/ui/font'
import { ArrowDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Flower from '@/app/ui/flower'
import Link from 'next/link'
import Cute from '../ui/about/something'

export default function Page() {
    return(
      <div className={`mt-12 md:mt-16 w-screen h-full grid grid-cols-2 md:grid-cols-3 grid-rows-6 gap-2 p-8 ${outfit.className}`}>
        <div className='col-span-2 row-span-1 md:row-span-2 border border-foreground p-2 md:p-4 rounded-xl flex flex-row md:items-end md:justify-end'>
          <p className='text-xl md:text-7xl xl:text-9xl whitespace-pre-wrap text-justify tracking wide'>
            Creative  web  developer   based   in  
            <span className='px-2 md:px-12'><img src='./mikita-yo-zIG7e6bhZaA-unsplash.jpg' className='hidden md:inline h-[4.3rem] xl:h-[6rem] w-[10rem] xl:w-[15rem] border-4 border-pink-400 object-cover'/></span>
            Milan
            <GlobeAltIcon className='h-[2rem] text-pink-400 md:h-[4.3rem] xl:h-[6rem] inline pl-12'/>
          </p>
        </div>

        <div className='row-span-2 md:row-span-3 border border-foreground p-4 rounded-xl'>Avatar</div>

        <div className='row-span-2 md:row-span-3 border border-foreground p-4 rounded-xl flex flex-col h-full justify-between'>
          <p className='text-xl md:text-7xl xl:text-9xl text-justify' style={{textAlignLast: 'justify'}}>WHERE TO</p>
          <div className='flex flex-col md:flex-row justify-between px-2 md:px-8 xl:text-2xl'>
            <Link href='https://github.com/0xMari' className='hover:text-pink-400'>github</Link>
            <Link href='https://www.linkedin.com/in/maria-jyate/' className='hover:text-pink-400'>linkedin</Link>
          </div>
          <p className='text-xl md:text-7xl xl:text-9xl text-justify' style={{textAlignLast: 'justify'}}>FIND ME</p>
        </div>

        <div className='col-span-2 md:col-span-1 md:row-span-2 border border-foreground p-2 md:p-4 rounded-xl'>
          <div className='flex flex-col h-full justify-center text-justify'>
            <p className='uppercase text-sm md:text-lg xl:text-xl self-end'> <ArrowDownIcon className='inline h-[0.6rem] md:h-[0.7rem] xl:h-[1rem]'/> fun facts </p>
            <p className='text-sm md:text-2xl/10 xl:text-5xl pl-2 md:pl-0 md:py-8 '>
              Rofan manhwa avid reader and skincare maniac.<br/>
              I like glitter, TTRPG, and good food.
            </p>
          </div>
          
        </div>

        <div className='border border-foreground p-4 rounded-xl col-span-2 md:col-span-1 row-span-2 md:row-span-3'>
          <h1 className={`${playFair.className} text-xl xl:text-3xl md:pb-6`}>tech stack</h1>
          <div className='flex flex-row flex-wrap gap-2 xl:text-2xl'>
            <div className='md:border border-foreground px-2 md:px-8 xl:px-16 md:py-2 xl:py-4 rounded-[50%]'>TypeScript</div>
            <div className='md:border border-foreground px-2 md:px-8 xl:px-16 md:py-2 xl:py-4 rounded-[50%]'>NextJS</div>
            <div className='md:border border-foreground px-2 md:px-8 xl:px-16 md:py-2 xl:py-4 rounded-[50%]'>ReactJS</div>
            <div className='md:border border-foreground px-2 md:px-8 xl:px-16 md:py-2 xl:py-4 rounded-[50%]'>ThreeJS</div>
            <div className='md:border border-foreground px-2 md:px-8 xl:px-16 md:py-2 xl:py-4 rounded-[50%]'>HTML/CSS</div>
            <div className='md:border border-foreground px-2 md:px-8 xl:px-16 md:py-2 xl:py-4 rounded-[50%]'>WebGL</div>
            <div className='md:border border-foreground px-2 md:px-8 xl:px-16 md:py-2 xl:py-4 rounded-[50%]'>Python</div>
          </div>
        </div>

        <div className='md:row-span-2 border border-foreground p-4 rounded-xl items-center'>
          <Cute />
        </div>

        <div className='border border-foreground p-4 rounded-xl'>7- currently listening to</div>
      </div>
    )
  }