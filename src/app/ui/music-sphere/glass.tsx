'use client'

import * as THREE from 'three';

import { Suspense, useEffect, useRef, useState } from 'react';

import vertexPars from '@/app/ui/music-sphere/Shader_noiseSphere/vertex_pars.glsl.js'
import vertexMain from '@/app/ui/music-sphere/Shader_noiseSphere/vertex_main.glsl.js'
import fragmentPars from '@/app/ui/music-sphere/Shader_noiseSphere/fragment_pars.glsl.js'
import fragmentMain from '@/app/ui/music-sphere/Shader_noiseSphere/fragment_main.glsl.js'

import vertexAll from '@/app/ui/music-sphere/Shader_noiseSphere/vertex.js'
import fragmentAll from '@/app/ui/music-sphere/Shader_noiseSphere/fragment.js'



import { Canvas, useFrame } from '@react-three/fiber';
import { Html, useProgress, useTexture } from '@react-three/drei';

import {motion} from 'framer-motion'
import {Pane} from 'tweakpane'

import './style.css'

import useMicrophone from './mic';


function NoiseSphere() {
    const meshRef = useRef<THREE.Mesh>(null)
    console.log(meshRef)

    // TODO
    // const volume = {
    //     target: 0,
    //     current: 0,
    //     upEasing: 0.1,
    //     downEasing: 0.1,
    // }
    // volume.target = useMicrophone().volume

    // const easing = volume.target > volume.current ? volume.upEasing : volume.downEasing
    // volume.current += (volume.target-volume.current) * easing* 1000
    // console.log(volume.current)
    

    const defaultConfig = {
        scale: 0.5,
        color: '#ffffff',
    }

    const [settings, setSettings] = useState({...defaultConfig})

    
    const holo = useTexture('/imgs/holo2.jpg')
    holo.mapping = THREE.EquirectangularReflectionMapping

    //sphere rotation anim

    useFrame(({clock}) =>{
        if(meshRef.current){
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.7
            meshRef.current.rotation.x = 0.5 * ( 1 + Math.sin(clock.getElapsedTime() * 0.7))
        }
    })

    useEffect(() =>{

        if(!meshRef.current) return
        console.log("Icosahedron ref:", meshRef.current); 

        const gui = new Pane()
        gui.element.classList.add("tweakpane");
        // gui.domElement.style.position = "absolute";
        // gui.domElement.style.top = "20px"; // Adjust vertical position
        // gui.domElement.style.left = "20px"; // Move to the left
        // gui.domElement.style.zIndex = "1000"; 
        
        const f = gui.addFolder({
            title: 'Sphere',
        })

        f.addBinding(settings, "scale", {min: 0.1, max:2, step:0.1})
        .on('change', (v)=>{
            setSettings((prev) => ({...prev, size: v.value}))
            if(meshRef.current){
                meshRef.current.scale.set(v.value,v.value,v.value)
            }
        })
        
            
        f.addBinding(settings, 'color', {picker:'inline', expanded:true})
        .on('change', (v) =>{
            setSettings((prev) => ({...prev, color: v.value}))
            if(meshRef.current){
                (meshRef.current.material as THREE.MeshPhysicalMaterial).color.set(v.value)
            }
        })

        
        return () => gui.dispose()
    }, [])

    return(
        
        <mesh
            ref= {meshRef}
            position={[0, 0, 0]}
        >
            <icosahedronGeometry args={[0.5, 200]}/>
            <meshPhysicalMaterial
                color={0xffffff}
                transmission={1}
                opacity={1}
                metalness={0}
                roughness={0}
                ior={1.52}
                thickness={0.1}
                specularIntensity={1}
                specularColor={0xffffff}
                side={THREE.DoubleSide}
                envMap={holo}
                onBeforeCompile={(shader) =>{
                    shader.uniforms.uTime = {value: 0}

                    // shader.uniforms.uLightAColor= {value: '#ff3e00'}
                    // shader.uniforms.uLightAIntensity = {value: 1.85}
                    // shader.uniforms.uLightAPosition = {value: new THREE.Spherical(1, 0.615, 2.049)}

                    // shader.uniforms.uLightBcolor= {value: '#0063ff'}
                    // shader.uniforms.uLightBIntensity = {value: 1.4}
                    // shader.uniforms.uLightBPosition = {value: new THREE.Spherical(1, 2.561, -1.844)}

                    // shader.uniforms.uSubdivision = {value: new THREE.Vector2(200,200)}

                    // shader.uniforms.uOffset={value: new THREE.Vector3()}

                    // shader.uniforms.uDisplacementStrenght = {value: volume.current}
                    // shader.uniforms.uDisplacementFrequency = {value: 2.120}

                    // shader.uniforms.uDistortionStrenght = {value: 0.65}
                    // shader.uniforms.uDistortionFrequency = {value: 1.5}

                    // shader.uniforms.uFresnelOffset={value: -1.609}
                    // shader.uniforms.uFresnelMultiplier={value: 3.587}
                    // shader.uniforms.uFresnelPower={value: 1.793}

                    // shader.vertexShader = shader.vertexShader.replace(
                    //     `#include <displacementmap_vertex>`,
                    //     `#include <displacementmap_vertex>` + vertexAll
                    // )
                    shader.vertexShader = shader.vertexShader.replace(
                        `#include <displacementmap_pars_vertex>`,
                        `#include <displacementmap_pars_vertex>` + vertexPars
                    )
                    shader.vertexShader = shader.vertexShader.replace(
                        `#include <displacementmap_vertex>`,
                        `#include <displacementmap_vertex>` + vertexMain
                    )
                    // shader.fragmentShader = shader.fragmentShader.replace(
                    //     `#include <bumpmap_pars_fragment>`,
                    //     `#include <bumpmap_pars_fragment>` + fragmentAll
                    // )
                    shader.fragmentShader = shader.fragmentShader.replace(
                        `#include <bumpmap_pars_fragment>`,
                        `#include <bumpmap_pars_fragment>` + fragmentPars
                    )
                    shader.fragmentShader = shader.fragmentShader.replace(
                        `#include <normal_fragment_maps>`,
                        `#include <normal_fragment_maps>` + fragmentMain
                    )
                }}
                />
        </mesh>
        
    )
}

//backdrop

function BackdropPlane(){
    const texture = useTexture('/imgs/holo2.jpg')
    texture.mapping = THREE.EquirectangularReflectionMapping

    return(
        <mesh position={[0,0,-10]}>
            <planeGeometry args={[25, 15]}/>
            <meshPhysicalMaterial
                color={0xb091f2}
                side={THREE.DoubleSide}
                roughness={0}
                ior={2.33}
                envMap={texture}
            />
        </mesh>
    )
}

//lights

function Lights(){
    return(
        <>
        <ambientLight intensity={0.1} />
        <directionalLight color={0xffdbff} intensity={0.5}/>
        </>
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
                animate={{opacity: loaded ? 0: 1}}
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

export default function MusicSphere(){
    
    return(
        <div className='w-full h-full relative'>
            
            <Canvas camera={{position: [0,0,3.4], fov:50}} className='top-0 left-0 h-[90vh]'>
                <color attach='background' args={['#000']} />
                <Suspense fallback={<Loader/>}>
                    <Lights/>
                    {/* <OrbitControls /> */}
                    <NoiseSphere />
                    <BackdropPlane />
                </Suspense>
                
            </Canvas>
            <div className='w-full h-20vh left-0 bottom-0 py-[20px]'>
                WIP. TODO: add audio input to change noise displacement. 
            </div>
        </div>
    )
}