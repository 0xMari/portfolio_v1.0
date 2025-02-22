import * as THREE from "three";
import { Suspense, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, MeshDistortMaterial, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { a as aThree} from '@react-spring/three'
import { useSpring } from '@react-spring/core'



import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { a } from '@react-spring/web'

import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


const AnimatedMaterial = aThree(MeshDistortMaterial);




function Scene() {
    const gltf = useLoader(GLTFLoader, '/flower.glb')

    const flower = useRef()
    const light = useRef()
    const [hovered, setHovered] = useState(false)

    console.log(gltf)

    useEffect(() => {
        // document.body.style.cursor = hovered
        //   ? 'pointer'
        //   : 'cross'
    }, [hovered])

    useFrame((state) => {
        light.current.position.x = state.pointer.x * 20
        light.current.position.y = state.pointer.y * 20
        if (flower.current) {
          flower.current.position.x = THREE.MathUtils.lerp(flower.current.position.x, hovered ? state.pointer.x / 2 : 0, 0.2)
          flower.current.position.y = THREE.MathUtils.lerp(
            flower.current.position.y,
            Math.sin(state.clock.elapsedTime / 1.5) / 6 + (hovered ? state.pointer.y / 2 : 0),
            0.2
          )
        }
    })


    const [{ wobble, coat, color, ambient, env, }] = useSpring(
        {
          wobble: hovered ? 0.8 : 0.4,
          coat: !hovered ? 0.5 : 1,
          ambient: !hovered ? 1.5 : 1,
          env: !hovered ? 1.4 : 1,
          color: hovered ? '#2ec7ff' : '#FF90CC',
          config: (n) => n === 'wobble' && hovered && { mass: 2, tension: 1000, friction: 10 }
        },
        [hovered]
    )

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={15}>
                <aThree.ambientLight intensity={ambient} />
                <aThree.pointLight ref={light} position-z={-15} intensity={10} color="#0000ff" />
            </PerspectiveCamera>
            <Suspense fallback={null}>
                <aThree.primitive 
                    ref={flower}
                    object={gltf.scene.children[0]}
                    scale={wobble}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}>
                    
                    <AnimatedMaterial  
                        color={color} 
                        envMapIntensity={env} 
                        clearcoat={coat} 
                        clearcoatRoughness={0} 
                        metalness={0} 
                        thickness={0.15}
                        roughness={0}
                        distort={0.1}
                        />
                    

                </aThree.primitive>
                <Environment preset='warehouse' />
                <ContactShadows
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[0, -1.6, 0]}
                    opacity={1}
                    width={15}
                    height={15}
                    blur={2.5}
                    far={1.6}
                />
            </Suspense>
        </>
    )
}




export default function Flower(){
    
    return(
        <a.main style={{ background: 'transparent', height: '100%'}}>
            <Canvas className="canvas" dpr={[1, 2]}>
                <Scene/>
                <OrbitControls 
                    enablePan={false}
                    enableZoom={false}
                    />

            </Canvas>
        </a.main>
    )
}