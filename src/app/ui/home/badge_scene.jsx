'use client'

import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { StickyNotes } from './sticky_notes'

const MODEL_PATH = '/badge8.glb'
const CORD_SEGMENTS = 28
const CORD_RADIUS = 0.01
const CORD_RADIAL_SEGMENTS = 8
const FALL_GRAVITY = 12
const FLOOR_BOUNCE = 0.18
const MOBILE_BADGE_Z = 0.62
const ACTIVE_MOBILE_BADGE_Z = 1.22

function createCordGeometry(curve) {
    return new THREE.TubeGeometry(curve, CORD_SEGMENTS, CORD_RADIUS, CORD_RADIAL_SEGMENTS, false)
}

function getSecondPageFloorY(viewport, stageSize) {
    const viewportHeight = stageSize.height || 1
    const scrollY = typeof window === 'undefined' ? 0 : window.scrollY
    const secondPageBottomY = viewportHeight * 2 - scrollY

    return (0.5 - secondPageBottomY / viewportHeight) * viewport.height + 0.48
}

function getScrollY() {
    return typeof window === 'undefined' ? 0 : window.scrollY
}

function Cord({ badgeRef, scene, viewport }) {
    const cord = useRef()
    const curve = useMemo(() => new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0.9, 0),
        new THREE.Vector3(0, 0.45, 0),
        new THREE.Vector3(0, 0, 0)
    ), [])
    const initialGeometry = useMemo(() => createCordGeometry(curve), [curve])

    const claspAnchor = useMemo(()=> scene.getObjectByName('clasp_anchor'), [scene])

    useFrame(()=>{
        if (!badgeRef.current || !cord.current?.geometry) return

        const end = new THREE.Vector3()

        if (claspAnchor){
            claspAnchor.getWorldPosition(end)
        } else {
            badgeRef.current.localToWorld(end.set(0, 4.1, 0.18))
        }

        const start = new THREE.Vector3(0, viewport.height / 2 + 0.35, end.z)
        const mid = start.clone().lerp(end, 0.5)
        const stretch = start.distanceTo(end)
        mid.y -= Math.min(stretch * 0.035, 0.45)

        curve.v0.copy(start)
        curve.v1.copy(mid)
        curve.v2.copy(end)

        cord.current.geometry.dispose()
        cord.current.geometry = createCordGeometry(curve)
    })

    return(
        <mesh ref={cord} frustumCulled={false}>
            <primitive object={initialGeometry} attach="geometry" />
            <meshStandardMaterial color="#151515" roughness={0.65} metalness={0.05} />
        </mesh>
    )

}

export function BadgeScene({
    screenPosition,
    stageSize,
    badgeMode,
    stickyNotes,
    mobileDeskMode = false,
    activeMobileItem = null,
    activeStickyNoteId = null,
}) {
    const badge = useRef()
    const fallVelocity = useRef(0)
    const landed = useRef(false)
    const { scene } = useGLTF(MODEL_PATH)
    const viewport = useThree((state) => state.viewport)

    useEffect(() => {
        const lanyard = scene.getObjectByName('lanyard')
        if (lanyard) lanyard.visible = false
    }, [scene])

    useEffect(() => {
        fallVelocity.current = 0
        landed.current = false
    }, [badgeMode])

    useFrame((state, delta) => {
        if (!badge.current) return

        const elapsed = state.clock.elapsedTime
        const safeDelta = Math.min(delta, 0.033)

        if (mobileDeskMode) {
            const viewportY = screenPosition.y - getScrollY()
            const worldX = ((screenPosition.x / stageSize.width) - 0.5) * viewport.width
            const worldY = (0.5 - (viewportY / stageSize.height)) * viewport.height

            badge.current.position.x = worldX
            badge.current.position.y = worldY
            badge.current.position.z = activeMobileItem === 'badge' ? ACTIVE_MOBILE_BADGE_Z : MOBILE_BADGE_Z
            badge.current.rotation.x = 0
            badge.current.rotation.y = 0.12
            badge.current.rotation.z = -0.16
            badge.current.updateWorldMatrix(true, true)
            return
        }

        if (badgeMode === 'fallen') {
            const floorY = getSecondPageFloorY(viewport, stageSize)
            const scrollY = typeof window === 'undefined' ? 0 : window.scrollY

            if (landed.current || scrollY < stageSize.height * 0.85) {
                badge.current.position.y = floorY
                fallVelocity.current = 0
                landed.current = true
            } else {
                fallVelocity.current -= FALL_GRAVITY * safeDelta
                badge.current.position.y += fallVelocity.current * safeDelta

                if (badge.current.position.y <= floorY) {
                    badge.current.position.y = floorY

                    if (Math.abs(fallVelocity.current) > 0.7) {
                        fallVelocity.current *= -FLOOR_BOUNCE
                    } else {
                        fallVelocity.current = 0
                        landed.current = true
                    }
                }
            }

            badge.current.position.x = THREE.MathUtils.damp(badge.current.position.x, 0, landed.current ? 3 : 1.4, safeDelta)
            badge.current.position.z = THREE.MathUtils.damp(badge.current.position.z, 0.62, 3, safeDelta)
            badge.current.rotation.x = THREE.MathUtils.damp(badge.current.rotation.x, -1.32, 4, safeDelta)
            badge.current.rotation.y = THREE.MathUtils.damp(badge.current.rotation.y, 0.12, 3, safeDelta)
            badge.current.rotation.z = THREE.MathUtils.damp(badge.current.rotation.z, -0.16, 3, safeDelta)
            badge.current.updateWorldMatrix(true, true)
            return
        }

        const worldX = ((screenPosition.x / stageSize.width) - 0.5) * viewport.width
        const worldY = (0.5 - (screenPosition.y / stageSize.height)) * viewport.height

        badge.current.position.x = worldX - 0.03
        badge.current.position.y = worldY - 3.3
        badge.current.position.z = 0.14
        badge.current.rotation.y = Math.sin(elapsed / 2.5) * 0.12
        badge.current.rotation.x = -0.08 + Math.sin(elapsed / 3) * 0.03
        badge.current.rotation.z = 0
        badge.current.updateWorldMatrix(true, true)

    }, -1)

    return (
        <>
            {badgeMode === 'attached' && !mobileDeskMode && <Cord badgeRef={badge} scene={scene} viewport={viewport}/>}
            <StickyNotes
                notes={stickyNotes}
                stageSize={stageSize}
                badgeMode={badgeMode}
                mobileDeskMode={mobileDeskMode}
                activeMobileItem={activeMobileItem}
                activeStickyNoteId={activeStickyNoteId}
            />
            <group ref={badge} scale={1} position={[-0.03, -3.3, 0.14]}>
                <primitive object={scene} />
            </group>
        </>
    )
}
