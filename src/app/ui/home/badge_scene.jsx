'use client'

import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

const MODEL_PATH = '/badge7.glb'
const CORD_SEGMENTS = 28
const CORD_RADIUS = 0.01
const CORD_RADIAL_SEGMENTS = 8

function createCordGeometry(curve) {
    return new THREE.TubeGeometry(curve, CORD_SEGMENTS, CORD_RADIUS, CORD_RADIAL_SEGMENTS, false)
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

export function BadgeScene({ screenPosition, stageSize }) {
    const badge = useRef()
    const { scene } = useGLTF(MODEL_PATH)
    const viewport = useThree((state) => state.viewport)

    useEffect(() => {
        const lanyard = scene.getObjectByName('lanyard')
        if (lanyard) lanyard.visible = false
    }, [scene])

    useFrame((state) => {
        if (!badge.current) return

        const elapsed = state.clock.elapsedTime
        const worldX = ((screenPosition.x / stageSize.width) - 0.5) * viewport.width
        const worldY = (0.5 - (screenPosition.y / stageSize.height)) * viewport.height

        badge.current.position.x = worldX - 0.03
        badge.current.position.y = worldY - 3.3
        badge.current.rotation.y = Math.sin(elapsed / 2.5) * 0.12
        badge.current.rotation.x = -0.08 + Math.sin(elapsed / 3) * 0.03
        badge.current.updateWorldMatrix(true, true)

    }, -1)

    return (
        <>
            <Cord badgeRef={badge} scene={scene} viewport={viewport}/>
            <group ref={badge} scale={1} position={[-0.03, -3.3, 0.14]}>
                <primitive object={scene} />
            </group>
        </>
    )
}
