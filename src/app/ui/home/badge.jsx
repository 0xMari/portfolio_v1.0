'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import { BadgeScene } from './badge_scene'
import { STICKY_NOTES } from './sticky_notes'


const MODEL_PATH = '/badge7.glb'
const INITIAL_Y = -0.62
const SPRING_STIFFNESS = 0.09
const SPRING_DAMPING = 0.78
const FALL_SCROLL_THRESHOLD = 0.85
const STICKY_NOTE_HITBOX = {
    desktop: { width: 360, height: 230 },
    narrow: { width: 230, height: 160 },
}

function createStickyNoteState() {
    return STICKY_NOTES.map((note) => ({
        id: note.id,
        lifted: false,
        position: null,
    }))
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function getScrollY() {
    return typeof window === 'undefined' ? 0 : window.scrollY
}

function getFirstPageViewportPosition(position) {
    if (!position) return null

    return {
        x: position.x,
        y: position.y - getScrollY(),
    }
}

function getStickyNoteRestPosition(stageSize) {
    const isNarrow = stageSize.width < 700

    return {
        x: stageSize.width * (isNarrow ? 0.5 : 0.23),
        y: stageSize.height * (isNarrow ? 0.78 : 0.71),
    }
}

function getStickyNoteHitbox(stageSize) {
    return stageSize.width < 700 ? STICKY_NOTE_HITBOX.narrow : STICKY_NOTE_HITBOX.desktop
}

function isInsideStickyNote(point, stickyPosition, stageSize) {
    if (!stickyPosition) return false

    const hitbox = getStickyNoteHitbox(stageSize)
    const halfWidth = hitbox.width / 2
    const halfHeight = hitbox.height / 2

    return (
        point.x >= stickyPosition.x - halfWidth &&
        point.x <= stickyPosition.x + halfWidth &&
        point.y >= stickyPosition.y - halfHeight &&
        point.y <= stickyPosition.y + halfHeight
    )
}

function getNextPileNote(stickyNotes) {
    return stickyNotes.find((note) => !note.lifted)
}

function getLiftedNoteAtPoint(point, stickyNotes, stageSize) {
    return [...stickyNotes]
        .reverse()
        .find((note) => note.lifted && isInsideStickyNote(point, getFirstPageViewportPosition(note.position), stageSize))
}


export default function Badge() {
    const stageRef = useRef(null)
    const dragLayerRef = useRef(null)
    const dragRef = useRef({ offsetX: 0, offsetY: 0 })
    const stickyDragRef = useRef({ offsetX: 0, offsetY: 0 })
    const isDraggingRef = useRef(false)
    const isStickyDraggingRef = useRef(false)
    const draggedStickyNoteIdRef = useRef(null)
    const badgeModeRef = useRef('attached')
    const positionRef = useRef(null)
    const stickyNotesRef = useRef(createStickyNoteState())
    const stickyPilePositionRef = useRef(null)
    const restPositionRef = useRef(null)
    const velocityRef = useRef({ x: 0, y: 0 })
    const [position, setPosition] = useState(null)
    const [stickyNotes, setStickyNotes] = useState(() => createStickyNoteState())
    const [stageSize, setStageSize] = useState({ width: 1, height: 1 })
    const [dragging, setDragging] = useState(false)
    const [stickyDragging, setStickyDragging] = useState(false)
    const [badgeMode, setBadgeMode] = useState('attached')

    const setBadgePosition = (nextPosition) => {
        positionRef.current = nextPosition
        setPosition(nextPosition)
    }

    const setStickyNoteState = (updater) => {
        setStickyNotes((current) => {
            const next = typeof updater === 'function' ? updater(current) : updater
            stickyNotesRef.current = next
            return next
        })
    }

    const stopDragging = (event) => {
        if (event?.pointerId != null && dragLayerRef.current?.hasPointerCapture(event.pointerId)) {
            dragLayerRef.current.releasePointerCapture(event.pointerId)
        }

        isDraggingRef.current = false
        isStickyDraggingRef.current = false
        draggedStickyNoteIdRef.current = null
        setDragging(false)
        setStickyDragging(false)
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
            const nextStickyRestPosition = getStickyNoteRestPosition(nextStageSize)

            setStageSize(nextStageSize)
            restPositionRef.current = nextRestPosition
            stickyPilePositionRef.current = nextStickyRestPosition

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

            setStickyNoteState((current) => (
                current.map((note) => {
                    if (!note.lifted) return note

                    const position = note.position ?? nextStickyRestPosition

                    return {
                        ...note,
                        position: {
                            x: clamp(position.x, 0, nextStageSize.width),
                            y: clamp(position.y, 0, nextStageSize.height),
                        },
                    }
                })
            ))
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
            isStickyDraggingRef.current = false
            draggedStickyNoteIdRef.current = null
            velocityRef.current = { x: 0, y: 0 }
            setDragging(false)
            setStickyDragging(false)
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

    const moveStickyNote = (event) => {
        const stage = stageRef.current
        const draggedStickyNoteId = draggedStickyNoteIdRef.current
        if (!stage || !draggedStickyNoteId) return

        const stageRect = stage.getBoundingClientRect()
        const scrollY = getScrollY()
        const nextPosition = {
            x: clamp(event.clientX - stageRect.left - stickyDragRef.current.offsetX, 0, stageRect.width),
            y: clamp(event.clientY - stageRect.top - stickyDragRef.current.offsetY + scrollY, 0, stageRect.height),
        }

        setStickyNoteState((current) => (
            current.map((note) => (
                note.id === draggedStickyNoteId
                    ? { ...note, lifted: true, position: nextPosition }
                    : note
            ))
        ))
    }

    const startStickyDrag = (noteId, notePosition, pointerPosition, dragLayer, pointerId, options = {}) => {
        const documentPosition = options.positionIsViewport
            ? {
                x: notePosition.x,
                y: notePosition.y + getScrollY(),
            }
            : notePosition
        const viewportPosition = options.positionIsViewport
            ? notePosition
            : getFirstPageViewportPosition(notePosition)

        stickyDragRef.current = {
            offsetX: pointerPosition.x - viewportPosition.x,
            offsetY: pointerPosition.y - viewportPosition.y,
        }

        setStickyNoteState((current) => (
            current.map((note) => (
                note.id === noteId
                    ? { ...note, lifted: true, position: documentPosition }
                    : note
            ))
        ))

        dragLayer.setPointerCapture(pointerId)
        draggedStickyNoteIdRef.current = noteId
        isStickyDraggingRef.current = true
        setStickyDragging(true)
    }

    const handlePointerDown = (event) => {
        const dragLayer = dragLayerRef.current
        if (!dragLayer) return

        const stage = stageRef.current
        if (!stage) return

        const stageRect = stage.getBoundingClientRect()
        const pointerPosition = {
            x: event.clientX - stageRect.left,
            y: event.clientY - stageRect.top,
        }

        const liftedStickyNote = getLiftedNoteAtPoint(pointerPosition, stickyNotesRef.current, stageSize)
        if (liftedStickyNote) {
            startStickyDrag(liftedStickyNote.id, liftedStickyNote.position, pointerPosition, dragLayer, event.pointerId)
            event.preventDefault()
            return
        }

        if (badgeModeRef.current !== 'attached') return

        const nextPileNote = getNextPileNote(stickyNotesRef.current)
        const pilePosition = stickyPilePositionRef.current
        if (nextPileNote && isInsideStickyNote(pointerPosition, pilePosition, stageSize)) {
            startStickyDrag(nextPileNote.id, pilePosition, pointerPosition, dragLayer, event.pointerId, {
                positionIsViewport: true,
            })
            event.preventDefault()
            return
        }

        const current = positionRef.current
        if (!current) return

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
        if (isStickyDraggingRef.current) {
            moveStickyNote(event)
            return
        }

        if (!isDraggingRef.current) return
        moveBadge(event)
    }

    return (
        <div ref={stageRef} className="fixed inset-0 z-10 overflow-hidden">
            <div
                ref={dragLayerRef}
                data-testid="badge-drag"
                className={`absolute inset-0 select-none ${dragging || stickyDragging ? 'cursor-grabbing touch-none' : badgeMode === 'attached' ? 'cursor-grab touch-pan-y' : 'cursor-default touch-pan-y'}`}
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
                            {position && (
                                <BadgeScene
                                    screenPosition={position}
                                    stageSize={stageSize}
                                    badgeMode={badgeMode}
                                    stickyNotes={stickyNotes}
                                />
                            )}
                            <Environment preset="studio" environmentIntensity={0.2} />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </div>
    )
}

useGLTF.preload(MODEL_PATH)
