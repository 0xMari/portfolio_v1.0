'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import { BadgeScene } from './badge_scene'


const MODEL_PATH = '/badge7.glb'
const INITIAL_Y = -0.62
const SPRING_STIFFNESS = 0.09
const SPRING_DAMPING = 0.78
const FALL_SCROLL_THRESHOLD = 0.85


function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}


export default function Badge() {
    const stageRef = useRef(null)
    const dragLayerRef = useRef(null)
    const dragRef = useRef({ offsetX: 0, offsetY: 0 })
    const isDraggingRef = useRef(false)
    const badgeModeRef = useRef('attached')
    const positionRef = useRef(null)
    const restPositionRef = useRef(null)
    const velocityRef = useRef({ x: 0, y: 0 })
    const [position, setPosition] = useState(null)
    const [stageSize, setStageSize] = useState({ width: 1, height: 1 })
    const [dragging, setDragging] = useState(false)
    const [badgeMode, setBadgeMode] = useState('attached')

    const setBadgePosition = (nextPosition) => {
        positionRef.current = nextPosition
        setPosition(nextPosition)
    }

    const stopDragging = (event) => {
        if (event?.pointerId != null && dragLayerRef.current?.hasPointerCapture(event.pointerId)) {
            dragLayerRef.current.releasePointerCapture(event.pointerId)
        }

        isDraggingRef.current = false
        setDragging(false)
    }

    useEffect(() => {
        let frame

        const placeBadgeHigh = () => {
            const stage = stageRef.current
            if (!stage) {
                frame = requestAnimationFrame(placeBadgeHigh)
                return
            }

            const stageRect = stage.getBoundingClientRect()
            const nextStageSize = { width: stageRect.width, height: stageRect.height }
            const nextRestPosition = {
                x: nextStageSize.width / 2,
                y: nextStageSize.height * INITIAL_Y,
            }

            setStageSize(nextStageSize)
            restPositionRef.current = nextRestPosition

            setPosition((current) => {
                if (current) {
                    const clamped = {
                        x: clamp(current.x, 0, nextStageSize.width),
                        y: clamp(current.y, -nextStageSize.height, nextStageSize.height),
                    }
                    positionRef.current = clamped
                    return clamped
                }

                positionRef.current = nextRestPosition
                return nextRestPosition
            })
        }

        frame = requestAnimationFrame(placeBadgeHigh)
        window.addEventListener('resize', placeBadgeHigh)

        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener('resize', placeBadgeHigh)
        }
    }, [])

    useEffect(() => {
        let frame

        const tick = () => {
            const current = positionRef.current
            const rest = restPositionRef.current

            if (badgeModeRef.current === 'attached' && !isDraggingRef.current && current && rest) {
                const velocity = velocityRef.current
                velocity.x = (velocity.x + (rest.x - current.x) * SPRING_STIFFNESS) * SPRING_DAMPING
                velocity.y = (velocity.y + (rest.y - current.y) * SPRING_STIFFNESS) * SPRING_DAMPING

                const next = {
                    x: current.x + velocity.x,
                    y: current.y + velocity.y,
                }

                if (
                    Math.abs(next.x - rest.x) < 0.35 &&
                    Math.abs(next.y - rest.y) < 0.35 &&
                    Math.abs(velocity.x) < 0.35 &&
                    Math.abs(velocity.y) < 0.35
                ) {
                    velocity.x = 0
                    velocity.y = 0
                    setBadgePosition(rest)
                } else {
                    setBadgePosition(next)
                }
            }

            frame = requestAnimationFrame(tick)
        }

        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [])

    useEffect(() => {
        const updateBadgeMode = () => {
            if (window.scrollY >= window.innerHeight * FALL_SCROLL_THRESHOLD) {
                setBadgeMode('fallen')
            }
        }

        updateBadgeMode()
        window.addEventListener('scroll', updateBadgeMode, { passive: true })
        window.addEventListener('resize', updateBadgeMode)

        return () => {
            window.removeEventListener('scroll', updateBadgeMode)
            window.removeEventListener('resize', updateBadgeMode)
        }
    }, [])

    useEffect(() => {
        badgeModeRef.current = badgeMode

        if (badgeMode === 'fallen') {
            isDraggingRef.current = false
            velocityRef.current = { x: 0, y: 0 }
            setDragging(false)
        }
    }, [badgeMode])

    useEffect(() => {
        window.addEventListener('mouseup', stopDragging)
        window.addEventListener('touchend', stopDragging)
        window.addEventListener('blur', stopDragging)

        return () => {
            window.removeEventListener('mouseup', stopDragging)
            window.removeEventListener('touchend', stopDragging)
            window.removeEventListener('blur', stopDragging)
        }
    }, [])

    const moveBadge = (event) => {
        const stage = stageRef.current
        if (!stage) return

        const stageRect = stage.getBoundingClientRect()
        setBadgePosition({
            x: clamp(event.clientX - stageRect.left - dragRef.current.offsetX, 0, stageRect.width),
            y: clamp(event.clientY - stageRect.top - dragRef.current.offsetY, -stageRect.height, stageRect.height),
        })
    }

    const handlePointerDown = (event) => {
        const dragLayer = dragLayerRef.current
        const current = positionRef.current
        if (!dragLayer || !current || badgeModeRef.current !== 'attached') return

        dragRef.current = {
            offsetX: event.clientX - current.x,
            offsetY: event.clientY - current.y,
        }
        velocityRef.current = { x: 0, y: 0 }
        dragLayer.setPointerCapture(event.pointerId)
        isDraggingRef.current = true
        setDragging(true)
    }

    const handlePointerMove = (event) => {
        if (!isDraggingRef.current) return
        moveBadge(event)
    }

    return (
        <div ref={stageRef} className="fixed inset-0 z-10 overflow-hidden">
            <div
                ref={dragLayerRef}
                data-testid="badge-drag"
                className={`absolute inset-0 select-none ${dragging ? 'cursor-grabbing touch-none' : badgeMode === 'attached' ? 'cursor-grab touch-pan-y' : 'cursor-default touch-pan-y'}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                onLostPointerCapture={stopDragging}
            >
                <div className="h-screen w-screen">
                    <Canvas
                        className="h-full w-full"
                        camera={{ position: [0, 0, 11], fov: 32 }}
                        dpr={[1, 2]}
                        gl={{ alpha: true, antialias: true }}
                        style={{ pointerEvents: 'none' }}
                    >
                        <ambientLight intensity={1} />
                        <directionalLight position={[2.5, 4, 4]} intensity={1.5} />
                        <directionalLight position={[-3, -1, 2]} intensity={0.8} color="#bcd7ff" />
                        <Suspense fallback={null}>
                            {position && <BadgeScene screenPosition={position} stageSize={stageSize} badgeMode={badgeMode} />}
                            <Environment preset="studio" environmentIntensity={0.2} />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </div>
    )
}

useGLTF.preload(MODEL_PATH)
