'use client'

import { useProgress } from '@react-three/drei'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

const HOME_SCENE_READY_EVENT = 'portfolio:home-scene-ready'
const MIN_LOADER_DURATION = 1700
const FADE_DURATION = 700

const loadingMessages = [
  'brewing coffee',
  'filling water bottle',
  'chat at desk',
  'opening to many tabs',
]

export default function Loader() {
  const pathname = usePathname()
  const { progress } = useProgress()
  const isHome = pathname === '/'
  const mountedAt = useRef(Date.now())
  const fadeStarted = useRef(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [homeSceneReady, setHomeSceneReady] = useState(!isHome)
  const [isFading, setIsFading] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const targetProgress = useMemo(() => {
    if (!isHome) return 100
    if (homeSceneReady) return 100

    return Math.min(progress, 96)
  }, [homeSceneReady, isHome, progress])

  useEffect(() => {
    if (isHome) {
      setHomeSceneReady(false)
      return
    }

    setHomeSceneReady(true)
  }, [isHome])

  useEffect(() => {
    const handleHomeSceneReady = () => {
      setHomeSceneReady(true)
    }

    window.addEventListener(HOME_SCENE_READY_EVENT, handleHomeSceneReady)

    return () => {
      window.removeEventListener(HOME_SCENE_READY_EVENT, handleHomeSceneReady)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const interval = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % loadingMessages.length)
    }, 850)

    return () => window.clearInterval(interval)
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let frame = 0

    const tick = () => {
      setDisplayProgress((current) => {
        const distance = targetProgress - current

        if (Math.abs(distance) < 0.08) return targetProgress
        return current + distance * 0.075
      })

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frame)
  }, [isVisible, targetProgress])

  useEffect(() => {
    const ready = !isHome || homeSceneReady
    const complete = displayProgress >= 100

    if (!isVisible || fadeStarted.current || !ready || !complete) return

    const elapsed = Date.now() - mountedAt.current
    const remaining = Math.max(MIN_LOADER_DURATION - elapsed, 0)
    fadeStarted.current = true

    const fadeTimer = window.setTimeout(() => {
      setIsFading(true)
    }, remaining)

    return () => {
      window.clearTimeout(fadeTimer)
    }
  }, [displayProgress, homeSceneReady, isHome, isVisible])

  useEffect(() => {
    if (!isFading) return

    const removeTimer = window.setTimeout(() => {
      setIsVisible(false)
    }, FADE_DURATION)

    return () => {
      window.clearTimeout(removeTimer)
    }
  }, [isFading])

  if (!isVisible) return null

  const percentage = Math.min(100, Math.max(0, Math.round(displayProgress)))

  return (
    <div
      className={`fixed inset-0 z-50 isolate bg-black font-mono text-[#f0f0f0] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        isFading ? 'pointer-events-none translate-y-[-1.5rem] opacity-0' : 'opacity-100'
      }`}
      aria-live='polite'
      aria-busy={!isFading}
    >
      <div className='absolute inset-0 grid place-items-center px-6 text-center'>
        <p
          key={messageIndex}
          className='animate-[loaderText_850ms_cubic-bezier(0.65,0,0.35,1)_both] text-sm uppercase tracking-[0.22em] sm:text-base'
        >
          {loadingMessages[messageIndex]}
        </p>
      </div>

      <div className='absolute bottom-0 left-0 h-16 w-full overflow-hidden'>
        <div
          className='absolute bottom-0 left-0 h-full bg-[#f0f0f0] transition-[width] duration-300 ease-out'
          style={{ width: `${displayProgress}%` }}
        />
        <div className='absolute bottom-4 right-5 z-10 font-mono text-xl font-semibold leading-none text-[#f0f0f0] mix-blend-difference sm:right-8 sm:text-2xl'>
          {percentage}%
        </div>
      </div>
    </div>
  )
}

export function notifyHomeSceneReady() {
  window.dispatchEvent(new CustomEvent(HOME_SCENE_READY_EVENT))
}
