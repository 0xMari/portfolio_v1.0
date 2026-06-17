import * as THREE from "three";
import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MarchingCubes, MarchingCube, Environment, MeshTransmissionMaterial, Text } from '@react-three/drei';
import { Physics, RigidBody, BallCollider } from '@react-three/rapier';


const MetaBall = ({ color, vec = new THREE.Vector3(), ...props }) => {
  const api = useRef();
  useFrame((state, delta) => {
    if (!api.current) return

    delta = Math.min(delta, 0.1)
    api.current.applyImpulse(
      vec
        .copy(api.current.translation())
        .normalize()
        .multiplyScalar(delta * -0.05),
      )
    
  })
  return (
    <RigidBody ref={api} colliders={false} linearDamping={4} angularDamping={0.95} {...props}>
      <MarchingCube strength={0.35} subtract={6} color={color} />
      <BallCollider args={[0.1]} type="dynamic" />
    </RigidBody>
  )
};

const Pointer = ({ vec = new THREE.Vector3() }) => {
  const ref = useRef()
  useFrame(({ pointer, viewport }) => {
    if (!ref.current) return

    const { width, height } = viewport.getCurrentViewport()
    vec.set(pointer.x * (width / 2), pointer.y * (height / 2), 0)
    ref.current.setNextKinematicTranslation(vec)
  })
  return (
    <RigidBody type="kinematicPosition" colliders={false} ref={ref}>
      <MarchingCube strength={0.5} subtract={10} />
      <BallCollider args={[0.1]} type="dynamic" />
    </RigidBody>
  )
};

const Blob = () => {
  return(
    <Suspense fallback={null}>
        <Physics gravity={[0, 0, 0]}>
          <group scale={[0.9, 2.4, 0.9]}>
            <MarchingCubes resolution={80} maxPolyCount={20000} enableUvs={false} enableColors>
            <MeshTransmissionMaterial  backside backsideThickness={1} thickness={1}  />
            <MetaBall position={[0, 0.7, 0]} />
            <MetaBall position={[0, 0.35, 0]} />
            <MetaBall position={[0, 0, 0]} />
            <MetaBall position={[0, -0.35, 0]} />
            <MetaBall position={[0, -0.7, 0]} />
            <Pointer />
            </MarchingCubes>
          </group>
            <Environment preset='city' />
        </Physics>
    </Suspense>

  )
};

const Typo = () => {
  return(
    <>
      <Text anchorX="center" rotation={[0, 0, -Math.PI / 2]} fontSize={2} letterSpacing={-0.025} color="black" position={[0 ,0,-7]}  font='/PlayfairDisplay-Regular.ttf'>
        Hi bestie!
      </Text>
    </>
  )
}


export default function Blobs(){
    return(
      <div className="h-full w-full overflow-hidden rounded-[inherit]">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
            <color attach="background" args={['#f0f0f0']} />
            <ambientLight intensity={1} />
            <Blob/>
            <Typo/>
        </Canvas>
      </div>
    )
}
