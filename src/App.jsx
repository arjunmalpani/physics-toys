import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Environment, OrbitControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useState } from "react";
import Toy from "./components/toy";

const rand = (min, max) => Math.random() * (max - min) + min;
function makeToy() {
    const bounce = rand(0.1, 0.9);
    return {
        id: crypto.randomUUID(),
        shape: Math.random() < 0.5 ? "ball" : "box",
        size: rand(0.4, 1),
        bounce,
        color: `hsl(${bounce * 60}, 90%, 55%)`,
        position: [rand(-3, 3), 8, rand(-3, 3)],
    };
}
const ARENA_WIDTH = 20;
const ARENA_HEIGHT = 12;
const WALL_THICKNESS = 0.5;

function App() {
    const [toys, setToys] = useState([]);

    const addToy = () => setToys((prev) => [...prev, makeToy()].slice(-60));
    return (
        <div className="relative h-screen w-screen">
            <Canvas camera={{ position: [8, 8, 12] }}>
                <ambientLight intensity={0.9} />
                <Environment preset="city" />

                <Physics>
                    <Arena
                        width={ARENA_WIDTH}
                        height={ARENA_HEIGHT}
                        thickness={WALL_THICKNESS}
                    />
                    {toys.map((t) => (
                        <Toy key={t.id} toy={t} />
                    ))}
                    <Toy
                        toy={{
                            id: "blue",
                            shape: "box",
                            size: 2,
                            bounce: 1,
                            color: "royalblue",
                            position: [0, 5, 0],
                        }}
                    />
                </Physics>
                <OrbitControls />
            </Canvas>
            <button
                onClick={addToy}
                className="cursor-pointer absolute left-4 top-4 z-10 rounded bg-text-h/10 px-4 py-2 text-text"
            >
                Drop one ({toys.length}/60)
            </button>
        </div>
    );
}

export default App;

function Arena({ width, height, thickness }) {
    return (
        <>
            <Wall position={[0, 0, 0]} args={[width, thickness, width]} />
            <Wall position={[0, height, 0]} args={[width, thickness, width]} />
            <Wall
                position={[0, height / 2, -width / 2]}
                args={[width, height, thickness]}
            />
            <Wall
                position={[0, height / 2, width / 2]}
                args={[width, height, thickness]}
            />
            <Wall
                position={[-width / 2, height / 2, 0]}
                args={[thickness, height, width]}
            />
            <Wall
                position={[width / 2, height / 2, 0]}
                args={[thickness, height, width]}
            />
        </>
    );
}

function Wall({ position, args }) {
    return (
        <RigidBody position={position} type="fixed">
            <mesh raycast={() => null}>
                <boxGeometry args={args} />
                <meshStandardMaterial color="black" transparent opacity={0} />
            </mesh>
        </RigidBody>
    );
}
