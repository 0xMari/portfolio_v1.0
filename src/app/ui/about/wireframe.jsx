import * as THREE from "three";
import { Canvas, useFrame} from '@react-three/fiber'
import { useRef } from "react";

function Toro(){
    const torus = new THREE.TorusGeometry(10,3,16,50)
    const hole = new THREE.TorusGeometry(10,9,22,100)
    const material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );

    const mesh = useRef()
    const mesh2 = useRef()

    useFrame(({ clock }, delta) => {
        if (!mesh.current) return

        mesh.current.rotation.z += delta * 0.4
        mesh.current.rotation.y += delta * 0.25
        mesh.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.15 + 12
    })
    useFrame(({ clock }, delta) => {
        if (!mesh2.current) return

        mesh2.current.rotation.z += delta * 0.25
    })

    return(
        <>
            <mesh ref={mesh} geometry={torus} material={material} position={[0, 20, -35]} rotation={[-Math.PI/2+0.5, 0, 0]}/>
            <group ref={mesh2} position={[0,-15,-20]} rotation={[Math.PI/2+0.3,0,0]}>
                <mesh geometry={hole}>
                    <meshBasicMaterial colorWrite={false} depthWrite side={THREE.DoubleSide}/>
                </mesh>
                <mesh geometry={hole}>
                    <meshBasicMaterial color='black' wireframe depthTest depthWrite={false}/>
                </mesh>

            </group>
        </>
    )
}

export default function Wire(){
    return(
        <>
        <Canvas className="h-full w-full" gl={{ alpha: true }}>
            <ambientLight intensity={1} />
            <Toro/>
        </Canvas>
        </>
    )
}