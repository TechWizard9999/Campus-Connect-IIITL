import React from 'react'
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei"
import { Text } from '@react-three/drei'
import { Float } from '@react-three/drei'
import { Model } from './Components/Model'
import { charactersAtom } from './Components/SocketManager'
import { useFrame } from '@react-three/fiber'
import { useAtom } from 'jotai'
import {socket} from "./Components/SocketManager"
import * as THREE from "three"
import {Physics, RapierRigidBody, RigidBody} from "@react-three/rapier"


// import Character from './Components/Character'


const Experience = () => {
  console.log(Model);


  const [characters] = useAtom(charactersAtom);
  console.log(characters);

  useFrame((state,delta)=>{

  //  state.camera.position(Model.position)

  })


  const Character = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf")
  // console.log(Character);
  return (

    <>
    {/* <Environment preset='sunset'  /> */}
      <ContactShadows  blur={2}/>
     <directionalLight  />
     {/* <Environment preset="forest" /> */}
      <ambientLight intensity={0.2} />
      <Float floatIntensity={2} speed={10} >

        <Text color={"grey"} position={[1, 3, 1]} >
          {/* <center> */}

       Testing...
          {/* </center> */}
        </Text>
      </Float>
      <OrbitControls />
      <directionalLight />
      <Physics debug >
      {/* <Model position={[3, 0, 0]} />
      <Model /> */}
      {
        characters.map((character)=>{
          return <Model key={character.id}  findme={character.id} position={
            new THREE.Vector3(
              character.position[0],
              character.position[1],
              character.position[2]
            )
          } />
        })
      }
      <RigidBody  type="fixed"  restitution={0} friction={1} colliders="hull"  > 
            <mesh rotation-x={-Math.PI / 2} position-y={-0.001} onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z])}>
        <planeGeometry args={[100,100]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
        </RigidBody> 
      </Physics>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial />
        {/* <primitive scen
      e={Model.object} /> */}


      </mesh>
      {/* <Model/> */}
      {/* <Characxter /> */}
      <primitive object={Character.scene} position={[-3, 0.5, 0]} />
      {/* <mesh position={[0, -1, 0]} >

        <boxGeometry args={[10, 0.5, 10]} />
        <meshNormalMaterial color={"cyan"} />

      </mesh> */}
      

    </>
  )
}

export default Experience