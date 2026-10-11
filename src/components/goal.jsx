import { CuboidCollider, RigidBody } from "@react-three/rapier";

export default function Goal({ position = [8, 1, 8], onScore }) {
    return (
        <RigidBody type="fixed" position={position}>
            <CuboidCollider
                args={[1.5, 1, 1.5]}
                sensor
                onIntersectionEnter={(payload) => {
                    const id = payload.other.rigidBodyObject?.userData?.id;
                    onScore(id);
                }}
            />
            <mesh>
                <boxGeometry args={[3, 2, 3]} />
                <meshStandardMaterial
                    color="limegreen"
                    transparent
                    opacity={0.25}
                />
            </mesh>
        </RigidBody>
    );
}
