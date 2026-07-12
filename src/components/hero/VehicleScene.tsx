"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  Sparkles,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

function VehicleBody() {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.15) * 0.3 + state.clock.elapsedTime * 0.08;
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={1.2}>
      {/* Main body */}
      <mesh ref={bodyRef} position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[3.2, 0.6, 1.4]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Cabin */}
      <mesh position={[0.1, 0.85, 0]} castShadow>
        <boxGeometry args={[1.6, 0.5, 1.2]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.2}
          chromaticAberration={0.02}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color="#88ccff"
          roughness={0}
        />
      </mesh>

      {/* Hood slope */}
      <mesh position={[-1.1, 0.55, 0]} rotation={[0, 0, -0.35]} castShadow>
        <boxGeometry args={[1.2, 0.15, 1.35]} />
        <meshStandardMaterial color="#222" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Rear */}
      <mesh position={[1.3, 0.5, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.8, 0.3, 1.3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Accent stripe */}
      <mesh position={[0, 0.72, 0.71]}>
        <boxGeometry args={[2.8, 0.02, 0.02]} />
        <meshStandardMaterial
          color="#5a8aad"
          emissive="#5a8aad"
          emissiveIntensity={2}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Wheels */}
      {[
        [-1, 0.15, 0.75],
        [-1, 0.15, -0.75],
        [1.1, 0.15, 0.75],
        [1.1, 0.15, -0.75],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
            <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.26, 32]} />
            <meshStandardMaterial
              color="#5a8aad"
              emissive="#5a8aad"
              emissiveIntensity={0.5}
              metalness={1}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[-1.62, 0.45, 0.45]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[-1.62, 0.45, -0.45]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={3}
        />
      </mesh>

      {/* Taillights */}
      <mesh position={[1.62, 0.45, 0.45]}>
        <boxGeometry args={[0.04, 0.12, 0.3]} />
        <meshStandardMaterial
          color="#ff3333"
          emissive="#ff3333"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[1.62, 0.45, -0.45]}>
        <boxGeometry args={[0.04, 0.12, 0.3]} />
        <meshStandardMaterial
          color="#ff3333"
          emissive="#ff3333"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}

function Particles() {
  return (
    <Sparkles
      count={80}
      scale={12}
      size={1.5}
      speed={0.2}
      opacity={0.3}
      color="#5a8aad"
    />
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight
        position={[5, 8, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-5, 5, -3]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        color="#5a8aad"
      />
      <pointLight position={[0, 2, 3]} intensity={0.5} color="#5aab82" />

      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <VehicleBody />
      </Float>

      <Particles />

      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={4}
      />

      <Environment preset="night" />
    </>
  );
}

interface VehicleSceneProps {
  className?: string;
  scrollProgress?: number;
}

export function VehicleScene({ className = "" }: VehicleSceneProps) {
  const cameraPosition = useMemo(() => new THREE.Vector3(0, 1.5, 6), []);

  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={["#050505", 8, 20]} />
        <Scene />
      </Canvas>
    </div>
  );
}
