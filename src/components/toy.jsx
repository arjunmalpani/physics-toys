import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
export default function Toy({ toy }) {
    const body = useRef();
    const handleClick = (e) => {
        e.stopPropagation();
        if (e.delta > 2) return; //ignore drag

        const point = e.point;
        const center = body.current.translation();
        const direction = new THREE.Vector3(center.x, center.y, center.z)
            .sub(point)
            .add(new THREE.Vector3(0, 0.8, 0))
            .normalize();
        const strength = 8;
        const mass = body.current.mass();
        const impluse = direction.multiplyScalar(strength * mass);
        // body.current.applyImpulse(impluse, true);
        body.current.applyImpulseAtPoint(impluse, point, true);
        console.log("toy clicked");
    };
    return (
        <RigidBody
            ref={body}
            userData={{ id: toy.id }}
            position={toy.position}
            restitution={toy.bounce}
            colliders={toy.shape === "ball" ? "ball" : "cuboid"}
            onClick={handleClick}

        >
            <mesh castShadow>
                {toy.shape === "ball" ? (
                    <sphereGeometry args={[toy.size, 32, 32]} />
                ) : (
                    <boxGeometry
                        args={[toy.size * 2, toy.size * 2, toy.size * 2]}
                    />
                )}
                <meshStandardMaterial color={toy.color} />
            </mesh>
        </RigidBody>
    );
}
