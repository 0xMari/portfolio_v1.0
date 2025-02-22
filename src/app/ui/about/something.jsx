
import {Canvas} from '@react-three/fiber';
import {OrbitControls, Environment} from '@react-three/drei';
import { a } from '@react-spring/web'

export default function Cute(){
    return(
        <div className='w-full h-full'>
            <a.main style={{ background: 'transparent'}}>
                <Canvas camera={{ position: [0, 0, 70], fov: 15 }}>
                    <OrbitControls 
                        enableZoom={false}
                        autoRotate={true}
                        autoRotateSpeed={5}
                        
                    />
                    <ambientLight intensity={5} args={['#ffffff']}/>
                    <mesh position={[-5.5, 0, 0]}>
                        <sphereGeometry args={[2]} />
                        <meshPhysicalMaterial color={'#ff00ff'} roughness={0} ior={1.5}/>
                    </mesh>
                    <mesh position={[6, 0, 0]}>
                        <sphereGeometry args={[3]} />
                        <meshStandardMaterial color={'#00ffff'} roughness={0} ior={1.5}/>
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[1]} />
                        <meshPhysicalMaterial color={'#ffff00'} roughness={0} ior={1.5}/>
                    </mesh>
                    <Environment preset='warehouse' />
                </Canvas>
            </a.main>
            
        </div>
    )
}