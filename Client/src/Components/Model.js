

import React, { useMemo, useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";
import { charactersAtom, socket } from "./SocketManager";
import { useAtom } from "jotai";
import { RigidBody } from "@react-three/rapier";


export function Model(props) {

    // try 
    const [characters] = useAtom(charactersAtom);
    console.log(characters);

    const character = characters.find((character) => { return character.id === socket.id });
    //    console.log(character);
    // console.log(character);

    //--
    const MOVEMENT_SPEED = 0.02;
    const position = useMemo(() => props.position, []);
    const colliderRef = useRef();
    const group = useRef();
    const { scene, materials, animations } = useGLTF("/Character.glb");
    const { actions } = useAnimations(animations, group);
    const [currentPosition, setCurrentPosition] = useState(position); // Added state for position

    console.log(actions);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])

    const [animation, setAnimation] = useState("CharacterArmature|Run");
    const { nodes } = useGraph(clone)
    useEffect(() => {

        actions[animation].reset().fadeIn(0.5).play()
        return () => { actions[animation]?.fadeOut(0.1) }

    }, [animation])
    // useFrame(()=>{
    //     if(group.current.position.distanceTo(props.position)>0.01){
    //         group.current.position
    //     }
    // })
    useFrame((state, delta) => {

        // colliderRef.current.position = group.current.position;
        // console.log(colliderRef.current.position);
        if (character.id === props.findme) {

            state.camera.position.copy(new THREE.Vector3(group.current.position.x, group.current.position.y + 5, group.current.position.z + 6));
            state.camera.lookAt(new THREE.Vector3(group.current.position.x, group.current.position.y + 2, group.current.position.z));
            // state.camera.rotation.copy(group.current.position);
        }
        // console.log(group.current.position);
        // console.log(props.position);
        if (group.current.position.distanceTo(props.position) > 0.01) {
            const direction = group.current.position
                .clone()
                .sub(props.position)
                .normalize()
                .multiplyScalar(MOVEMENT_SPEED);
            group.current.position.sub(direction);
            group.current.lookAt(props.position);
            setAnimation("CharacterArmature|Run");
        } else {
            setAnimation("CharacterArmature|Idle");
        }
    });
    useEffect(() => {
        const handleKeyPress = (event) => {
            const newPosition = currentPosition.clone();

            switch (event.key.toLowerCase()) {
                case "w":
                    newPosition.z -= 0.1;
                    break;
                case "a":
                    newPosition.x -= 0.1;
                    break;
                case "s":
                    newPosition.z += 0.1;
                    break;
                case "d":
                    newPosition.x += 0.1;
                    break;
                default:
                    return;
            }
            console.log(newPosition);
            socket.emit("move", [newPosition.x, newPosition.y, newPosition.z]);
            setCurrentPosition(newPosition);
        };

        const handleKeyRelease = () => {
            // You can reset the animation here when a key is released
            const newPosition = currentPosition.clone();
            console.log("release diya" + newPosition)
            console.log(newPosition)
            socket.emit("move", [newPosition.x, newPosition.y, newPosition.z]);
            setCurrentPosition(newPosition);



        };

        document.addEventListener("keydown", handleKeyPress);
        document.addEventListener("keyup", handleKeyRelease);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
            document.removeEventListener("keyup", handleKeyRelease);
        };
    }, [currentPosition]);



    return (
        <group ref={group} {...props} position={position} dispose={null} >
            <group name="Root_Scene">
                <group name="RootNode">
                    <group
                        name="CharacterArmature"
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={100}
                    >
                        <primitive object={nodes.Root} />
                    </group>
                    <group
                        name="Rogue"
                        position={[0, 0, 0.166]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={100}
                    >
                        <skinnedMesh
                            name="Rogue_1"
                            geometry={nodes.Rogue_1.geometry}
                            material={materials.Skin}
                            skeleton={nodes.Rogue_1.skeleton}
                        />
                        <skinnedMesh
                            name="Rogue_2"
                            geometry={nodes.Rogue_2.geometry}
                            material={materials.UnderShirt}
                            skeleton={nodes.Rogue_2.skeleton}
                        />
                        <skinnedMesh
                            name="Rogue_3"
                            geometry={nodes.Rogue_3.geometry}
                            material={materials.Pants}
                            skeleton={nodes.Rogue_3.skeleton}
                        />
                        <skinnedMesh
                            name="Rogue_4"
                            geometry={nodes.Rogue_4.geometry}
                            material={materials.Shirt}
                            skeleton={nodes.Rogue_4.skeleton}
                        />
                        <skinnedMesh
                            name="Rogue_5"
                            geometry={nodes.Rogue_5.geometry}
                            material={materials.Detail}
                            skeleton={nodes.Rogue_5.skeleton}
                        />
                        <skinnedMesh
                            name="Rogue_6"
                            geometry={nodes.Rogue_6.geometry}
                            material={materials.Boots}
                            skeleton={nodes.Rogue_6.skeleton}
                        />
                    </group>
                    <skinnedMesh
                        name="Rogue001"
                        geometry={nodes.Rogue001.geometry}
                        material={materials["Material.006"]}
                        skeleton={nodes.Rogue001.skeleton}
                        position={[0, 0, 0.166]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={100}
                    />
                </group>
            </group>
            {/* </RigidBody> */}
        </group>
    );
}

useGLTF.preload("/Character.glb");
