"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { useShowroom } from "../ShowroomProvider";
import { ShowroomVehicle } from "./ShowroomVehicle";
import { CameraRig } from "./CameraRig";
import { HotspotMarkers } from "./HotspotMarkers";

function StudioScene() {
  const {
    product,
    config,
    mode,
    cameraView,
    hoveredPart,
    selectedPart,
    data,
  } = useShowroom();

  const colorHex =
    product.configurator.colors.find((c) => c.id === config.color)?.hex ?? "#1a1a1a";

  return (
    <>
      <PerspectiveCamera makeDefault position={[5.5, 1.8, 5.5]} fov={32} />
      <CameraRig view={cameraView} />

      <ambientLight intensity={0.15} />
      <spotLight
        position={[6, 10, 4]}
        angle={0.25}
        penumbra={1}
        intensity={2.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight position={[-6, 6, -4]} angle={0.35} penumbra={1} intensity={1.2} color="#6a9ec4" />
      <spotLight position={[0, 4, -6]} angle={0.4} penumbra={1} intensity={0.6} color="#5aab82" />
      <directionalLight position={[3, 5, 2]} intensity={0.4} />

      <ShowroomVehicle
        product={product}
        config={config}
        bodyColor={colorHex}
        mode={mode}
        hoveredPart={hoveredPart}
        selectedPart={selectedPart}
        accessories={config.accessories}
        accessoryDefs={data.accessories}
      />

      <HotspotMarkers />

      <ContactShadows
        position={[0, -0.35, 0]}
        opacity={0.55}
        scale={12}
        blur={2.8}
        far={5}
        color="#000000"
      />

      <Environment preset="studio" />
      <fog attach="fog" args={["#0a0e12", 12, 28]} />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2 + 0.15}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.4}
        zoomSpeed={0.6}
      />
    </>
  );
}

export function ShowroomCanvas() {
  return (
    <div className="showroom-canvas relative h-full w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        className="touch-none"
      >
        <Suspense fallback={null}>
          <StudioScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
