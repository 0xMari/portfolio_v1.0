'use client'

import * as THREE from 'three'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'

const MODEL_PATH = '/badge7.glb'
const INITIAL_Y = -0.62
const SPRING_STIFFNESS = 0.09
const SPRING_DAMPING = 0.78
const CORD_SEGMENTS = 28

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function BadgeScene({ screenPosition, stageSize }) {
    const badge = useRef()
    const cordGeometry = useRef()
    const cordPositions = useMemo(() => new Float32Array((CORD_SEGMENTS + 1) * 3), [])
    const { scene } = useGLTF(MODEL_PATH)
    const viewport = useThree((state) => state.viewport)

    useEffect(() => {
        const lanyard = scene.getObjectByName('lanyard')
        if (lanyard) lanyard.visible = false
    }, [scene])

    useFrame((state) => {
        if (!badge.current || !cordGeometry.current) return

        const elapsed = state.clock.elapsedTime
        const worldX = ((screenPosition.x / stageSize.width) - 0.5) * viewport.width
        const worldY = (0.5 - (screenPosition.y / stageSize.height)) * viewport.height

        badge.current.position.x = worldX - 0.03
        badge.current.position.y = worldY - 3.3
        badge.current.rotation.y = Math.sin(elapsed / 2.5) * 0.12
        badge.current.rotation.x = -0.08 + Math.sin(elapsed / 3) * 0.03
        badge.current.updateWorldMatrix(true, true)

        const claspAnchor = scene.getObjectByName('clasp_anchor')
        const end = new THREE.Vector3()
        if (claspAnchor) {
            claspAnchor.getWorldPosition(end)
        } else {
            badge.current.localToWorld(end.set(0, 4.1, 0.18))
        }

        const start = new THREE.Vector3(0, viewport.height / 2 + 0.35, end.z)
        const mid = start.clone().lerp(end, 0.5)
        const stretch = start.distanceTo(end)
        mid.y -= Math.min(stretch * 0.035, 0.45)

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
        for (let i = 0; i <= CORD_SEGMENTS; i++) {
            const point = curve.getPoint(i / CORD_SEGMENTS)
            const offset = i * 3
            cordPositions[offset] = point.x
            cordPositions[offset + 1] = point.y
            cordPositions[offset + 2] = point.z
        }

        cordGeometry.current.attributes.position.needsUpdate = true
        cordGeometry.current.computeBoundingSphere()
    })

    return (
        <>
            <line frustumCulled={false}>
                <bufferGeometry ref={cordGeometry}>
                    <bufferAttribute attach="attributes-position" args={[cordPositions, 3]} />
                </bufferGeometry>
                <lineBasicMaterial color="#151515" transparent opacity={0.82} />
            </line>
            <group ref={badge} scale={1} position={[-0.03, -3.3, 0.14]}>
                <primitive object={scene} />
            </group>
        </>
    )
}

export default function Badge() {
    const stageRef = useRef(null)
    const dragLayerRef = useRef(null)
    const dragRef = useRef({ offsetX: 0, offsetY: 0 })
    const isDraggingRef = useRef(false)
    const positionRef = useRef(null)
    const restPositionRef = useRef(null)
    const velocityRef = useRef({ x: 0, y: 0 })
    const [position, setPosition] = useState(null)
    const [stageSize, setStageSize] = useState({ width: 1, height: 1 })
    const [dragging, setDragging] = useState(false)

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

            if (!isDraggingRef.current && current && rest) {
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
        if (!dragLayer || !current) return

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
        <div ref={stageRef} className="relative h-full min-h-screen w-full overflow-hidden">
            <div
                ref={dragLayerRef}
                data-testid="badge-drag"
                className={`absolute inset-0 touch-none select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
                            {position && <BadgeScene screenPosition={position} stageSize={stageSize} />}
                            <Environment preset="studio" environmentIntensity={0.2} />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </div>
    )
}

useGLTF.preload(MODEL_PATH)
