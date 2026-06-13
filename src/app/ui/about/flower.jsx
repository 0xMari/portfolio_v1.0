import * as THREE from "three";
import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, MeshDistortMaterial, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function Scene() {
    const gltf = useLoader(GLTFLoader, '/flower.glb')

    const flower = useRef()

    useFrame((state) => {
        if (flower.current) {
          const elapsed = state.clock.elapsedTime
          flower.current.position.x = THREE.MathUtils.lerp(
            flower.current.position.x,
            Math.sin(elapsed / 2.5) / 10,
            0.05
          )
          flower.current.position.y = THREE.MathUtils.lerp(
            flower.current.position.y,
            Math.sin(elapsed / 1.5) / 6,
            0.05
          )
          flower.current.rotation.y = Math.sin(elapsed / 3) / 12
        }
    })

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={15}>
                <ambientLight intensity={1.5} />
                <pointLight position={[0, 0, -15]} intensity={10} color="#0000ff" />
            </PerspectiveCamera>
            <group ref={flower} scale={0.4}>
                {gltf.scene.children.map((part, index) => (
                  <mesh
                    key={part.uuid}
                    geometry={part.geometry}
                    position={part.position}
                    rotation={part.rotation}
                    scale={part.scale}>
                    <MeshDistortMaterial
                        color={index === 0 ? '#FF90CC' : '#2ec7ff'}
                        envMapIntensity={1.4}
                        clearcoat={0.5}
                        clearcoatRoughness={0}
                        metalness={0} 
                        thickness={0.15}
                        roughness={0}
                        distort={0.1}
                    />
                  </mesh>
                ))}
            </group>
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
        </>
    )
}




export default function Flower(){
    return(
        <main style={{ background: 'transparent', height: '100%', pointerEvents: 'none' }}>
            <Canvas className="canvas" dpr={[1, 2]}>
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
        </main>
    )
}
