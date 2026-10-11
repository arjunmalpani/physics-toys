import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Environment, OrbitControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useState } from "react";
import Toy from "./components/toy";
import Goal from "./components/goal";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
const rand = (min, max) => Math.random() * (max - min) + min;
function makeToy() {
    const bounce = rand(0.1, 0.9);
    return {
        id: uuidv4(),
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
const defaultToy = {
    id: "blue",
    shape: "box",
    size: 2,
    bounce: 1,
    color: "royalblue",
    position: [0, 5, 0],
};
const TARGET = 10;
function App() {
    const [toys, setToys] = useState([defaultToy]);
    const [score, setScore] = useState(0);
    const scored = useRef(new Set());
    const [round, setRound] = useState(1);

    const won = score >= TARGET;

    const addToy = () => setToys((prev) => [...prev, makeToy()].slice(-60));
    const handleScore = (id) => {
        if (won) return;
        if (!id || scored.current.has(id)) return; // aleardy goaled
        scored.current.add(id);
        setScore((prev) => prev + 1); // increament score
        setToys((prev) => prev.filter((t) => t.id !== id)); // disapprear
    };
    const handleReset = () => {
        setToys([defaultToy]);
        setScore(0);
        scored.current.clear();
        setRound((r) => r + 1);
    };
    return (
        <div className="relative h-screen w-screen">
            <Canvas dpr={[1, 1.5]} camera={{ position: [-8, 8, -12] }} shadows>
                <ambientLight intensity={1} />
                <Environment preset="city" />
                <directionalLight
                    position={[6, 14, 4]}
                    intensity={2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-left={-12}
                    shadow-camera-right={12}
                    shadow-camera-top={12}
                    shadow-camera-bottom={-12}
                    shadow-bias={-0.0005}
                />
                <Physics key={round}>
                    <Arena
                        width={ARENA_WIDTH}
                        height={ARENA_HEIGHT}
                        thickness={WALL_THICKNESS}
                    />
                    <Goal onScore={handleScore} />
                    {toys.map((t) => (
                        <Toy key={t.id} toy={t} />
                    ))}
                </Physics>
                <OrbitControls />
            </Canvas>
            {won && (
                <div className="pointer-events-none fixed inset-0 flex flex-col items-center justify-end gap-3 bg-black/30 pb-16 text-white">
                    <h2 className="text-4xl font-bold">You win!</h2>
                    <p>{score} goals</p>
                    <button
                        onClick={handleReset}
                        className="pointer-events-auto rounded-lg bg-white/20 px-6 py-3 hover:bg-white/30"
                    >
                        Play again
                    </button>
                </div>
            )}{" "}
            <button
                onClick={addToy}
                disabled={won}
                className="cursor-pointer absolute left-4 top-4 z-10 rounded-lg bg-text-h/10 px-4 py-2 text-text disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Drop one ({toys.length}/60)
            </button>
            <div className="absolute right-4 top-4 z-10 flex w-max flex-col items-end gap-2">
                <div className="rounded-lg bg-text-h/10 px-4 py-2 text-sm font-medium text-text shadow-sm">
                    Score: {score} <span className="mx-1 opacity-50">|</span>{" "}
                    Target: {TARGET}
                </div>

                <button
                    onClick={handleReset}
                    className="cursor-pointer rounded-lg bg-text-h/10 px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-text-h/20 active:scale-95"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

export default App;

function Arena({ width, height, thickness }) {
    return (
        <>
            <Wall
                position={[0, 0, 0]}
                args={[width, thickness, width]}
                opacity={1}
            />
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

function Wall({ position, args, color = "black", opacity = 0 }) {
    return (
        <RigidBody position={position} type="fixed">
            <mesh raycast={() => null} receiveShadow>
                <boxGeometry args={args} />
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={opacity}
                />
            </mesh>
        </RigidBody>
    );
}
