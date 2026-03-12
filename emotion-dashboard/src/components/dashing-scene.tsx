'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles, OrbitControls, Points, PointMaterial } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

function generateSpherePoints(count: number, radius: number) {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = radius * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
    }
    return points;
}

function StarField(props: any) {
    const ref = useRef<any>(null)
    const [sphere] = useState(() => generateSpherePoints(5000, 1.5))

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10
            ref.current.rotation.y -= delta / 15
        }
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial transparent color="#f272c8" size={0.005} sizeAttenuation={true} depthWrite={false} />
            </Points>
        </group>
    )
}

function AnimatedBackground() {
    return (
        <>
            <color attach="background" args={['#050511']} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={50} scale={10} size={4} speed={0.4} opacity={0.5} noise={0.2} color="cyan" />
            <StarField />
        </>
    )
}

export default function DashingScene() {
    return (
        <div className="fixed inset-0 z-0 select-none pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <AnimatedBackground />
                {/* <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} /> */}
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10 pointer-events-none" />
        </div>
    )
}
