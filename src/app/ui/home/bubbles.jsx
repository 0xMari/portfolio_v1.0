'use client'
import {Suspense, useEffect, useRef, useState} from 'react' 
import * as THREE from 'three';
import {Canvas, useFrame, useThree, createPortal} from '@react-three/fiber';
import {Text, useGLTF, useFBO, MeshTransmissionMaterial, Preload, ScrollControls, Scroll, useProgress, Html} from '@react-three/drei';
import { easing } from 'maath'
import {motion, AnimatePresence} from 'framer-motion'



const Typo = () => {
  const {viewport} = useThree()
  const fontSizeFct = viewport.width < 6 ? 0.5 : viewport.width < 12 ? 1 : 2
    return(
      <>
        <Text anchorX="left" fontSize={2 * fontSizeFct} letterSpacing={-0.025} color="black" position={[-6.2 ,1.5,-7]} font='/PlayfairDisplay-Regular.ttf'>
          Hi bestie!
        </Text>
        <Text anchorX="left" fontSize={0.5 * fontSizeFct} letterSpacing={-0.025} color="black" position={[-6.0 , 0.3 ,-7]} font='/PlayfairDisplay-Regular.ttf'>
          I'm
        </Text>
        <Text anchorX="left" fontSize={3.5 * fontSizeFct} letterSpacing={-0.025} color="black" position={[-5.6,-0.8,-7]} font='/PlayfairDisplay-Italic.ttf'>
          MARIA
        </Text>
      </>
    )
}

const Blob = () =>{
  return(
    <>
    <directionalLight position={[5, 5, 5]} intensity={2} />
    <pointLight position={[-5, -5, 5]} intensity={5} />

    <mesh position={[0, -5, -5]}>
      <sphereGeometry args={[1]} />
      <meshPhysicalMaterial color={'#ff00ff'} transparent={true} roughness={0} ior={1.5}/>
    </mesh>
    </>
    
  )
}

function Lens({ children, damping = 0.15, ...props }) {
    const ref = useRef()
    const { nodes } = useGLTF('/lens-transformed.glb')
    const buffer = useFBO()
    const viewport = useThree((state) => state.viewport)
    const [scene] = useState(() => new THREE.Scene())
    useFrame((state, delta) => {
      // Tie lens to the pointer
      // getCurrentViewport gives us the width & height that would fill the screen in threejs units
      // By giving it a target coordinate we can offset these bounds, for instance width/height for a plane that
      // sits 15 units from 0/0/0 towards the camera (which is where the lens is)
      const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 15])
      easing.damp3(
        ref.current.position,
        [(state.pointer.x * viewport.width) / 2, (state.pointer.y * viewport.height) / 2, 15],
        damping,
        delta
      )
      // This is entirely optional but spares us one extra render of the scene
      // The createPortal below will mount the children of <Lens> into the new THREE.Scene above
      // The following code will render that scene into a buffer, whose texture will then be fed into
      // a plane spanning the full screen and the lens transmission material
      state.gl.setRenderTarget(buffer)
      state.gl.setClearColor('#ffffff')
      state.gl.render(scene, state.camera)
      state.gl.setRenderTarget(null)
    })
    return (
      <>
        {createPortal(children, scene)}
        <mesh scale={[viewport.width, viewport.height, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={buffer.texture} />
        </mesh>
        <mesh scale={0.25} ref={ref} rotation-x={Math.PI / 2} geometry={nodes.Cylinder.geometry} {...props}>
          <MeshTransmissionMaterial buffer={buffer.texture} ior={1.2} thickness={1.5} anisotropy={0.1} chromaticAberration={0.4} />
        </mesh>
      </>
    )
}

const list = [
  {
    alt : 'my cousin',
    src: './',
  },
  {
    alt : "mom's friends",
    src: './',
  },
  {
    alt : 'friends&family',
    src: './',
  },
  {
    alt : 'coworkers',
    src: './',
  },
]

function HtmlSection (){
  return(
    <div className='absolute top-[100vh] md:top-[150vh] w-[100vw] h-[100vh]'>
      <h1 className='text-center uppercase font-playFair text-lg md:text-2xl'>i've collaborated with</h1>
      <div className='flex flex-row gap-2 items-center justify-around pt-10 md:pt-[20vh]'>
        {list.map((item)=>{
          return(
            <div key={item.alt} className='uppercase font-outFit text-sm md:text-base lg:text-lg'>{item.alt}</div>
          )
        })}
      </div>
    </div>
  )
}

function Loader(){
  const {progress} = useProgress()
  const [loaded, setLoaded] = useState(false)

    return(
        <Html center>
            <motion.div
                className='fixed inset-0 flex flex-col items-center justify-center bg-black text-white'
                initial={{opacity: 1}}
                // animate={{opacity: loaded ? 0: 1}}
                transition={{duration: 1, delay: 0.5}}
            >
                <motion.div
                    className='relative w-48 h-1 bg-grey-700 rounded-md overflow-hidden'
                    initial={{scaleX:0}}
                    animate={{scaleX: progress/100}}
                    transition={{duration: 0.5}}
                >
                    <div className='absolute left-0 top-0 h-full bg-indigo-400 w-full'></div>
                </motion.div>
                <p className='mt-4 text-sm font-medium'>{Math.floor(progress)}% Loading</p>
            </motion.div>
        </Html>
    )
  
}




export function Bubbles(){
    const [fov, setFov] = useState(15)

    useEffect(() =>{
      const updateFov = () =>{
        const width = window.innerWidth
        setFov(width < 768 ? 50 : width < 1280 ? 30 : 15);
      }
      updateFov()
      window.addEventListener('resize', updateFov);
      return () => window.removeEventListener('resize', updateFov);
    }, [])
    
    return(
        <div className='w-full h-full'>
            <Canvas camera={{ position: [0, 0, 20], fov: fov }}>
                <color attach="background" args={['#f0f0f0']} />
                <ambientLight intensity={10} args={['#ffffff']}/>
                <Suspense fallback={<Loader/>}>
                  <ScrollControls pages={3} damping={0.2}>
                    <Lens>
                      <Scroll>
                        <Typo />
                        <Blob />
                        <Preload />
                      </Scroll>
                      <Scroll html>
                        <HtmlSection/>
                      </Scroll>
                    </Lens>
                  </ScrollControls>
                </Suspense>
                
            </Canvas>
          
        </div>

       
    )
}