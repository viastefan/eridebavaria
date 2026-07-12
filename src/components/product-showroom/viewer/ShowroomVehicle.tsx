"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { ShowroomConfig } from "@/lib/showroom-types";
import { getVehicleProfile, type VehicleProfile } from "@/lib/showroom-types";
import type { Product } from "@/lib/types";
import { EXPLODED_OFFSETS } from "@/lib/showroom-data";

interface VehicleModelProps {
  product: Product;
  config: ShowroomConfig;
  bodyColor: string;
  mode: string;
  hoveredPart: string | null;
  selectedPart: string | null;
  accessories: string[];
  accessoryDefs: {
    id: string;
    attachPosition: [number, number, number];
    attachScale?: number;
    meshType: string;
  }[];
}

function getDimensions(profile: VehicleProfile) {
  switch (profile) {
    case "motorcycle":
      return { length: 3.6, height: 0.55, width: 0.5, wheelY: 0.18, wheelR: 0.38 };
    case "moped":
      return { length: 2.8, height: 0.75, width: 1.3, wheelY: 0.22, wheelR: 0.32 };
    case "truck":
      return { length: 4.2, height: 1.0, width: 1.6, wheelY: 0.28, wheelR: 0.38 };
    case "quad":
      return { length: 2.6, height: 0.65, width: 1.5, wheelY: 0.25, wheelR: 0.4 };
    case "scooter":
      return { length: 2.0, height: 0.7, width: 0.7, wheelY: 0.2, wheelR: 0.28 };
    default:
      return { length: 3.4, height: 0.7, width: 1.4, wheelY: 0.22, wheelR: 0.34 };
  }
}

function lerp3(
  base: [number, number, number],
  offset: [number, number, number],
  t: number
): THREE.Vector3 {
  return new THREE.Vector3(
    base[0] + offset[0] * t,
    base[1] + offset[1] * t,
    base[2] + offset[2] * t
  );
}

function AccessoryMesh({
  type,
  position,
  scale = 1,
}: {
  type: string;
  position: [number, number, number];
  scale?: number;
}) {
  const color = "#6a9ec4";
  if (type === "rack") {
    return (
      <mesh position={position} scale={scale}>
        <boxGeometry args={[1.8, 0.04, 0.9]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.2} />
      </mesh>
    );
  }
  if (type === "light-bar") {
    return (
      <mesh position={position} scale={scale}>
        <boxGeometry args={[0.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
      </mesh>
    );
  }
  if (type === "cylinder") {
    return (
      <mesh position={position} rotation={[0, 0, Math.PI / 2]} scale={scale}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.15} />
      </mesh>
    );
  }
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[0.6, 0.35, 0.5]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
    </mesh>
  );
}

export function ShowroomVehicle({
  product,
  config,
  bodyColor,
  mode,
  hoveredPart,
  selectedPart,
  accessories,
  accessoryDefs,
}: VehicleModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const batteryRef = useRef<THREE.Group>(null);
  const motorRef = useRef<THREE.Group>(null);
  const cargoRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<(THREE.Group | null)[]>([]);
  const explodeT = useRef(0);

  const profile = getVehicleProfile(product);
  const dims = getDimensions(profile);
  const isMotorcycle = profile === "motorcycle";
  const wheelStyle =
    config.wheels.includes("custom") || config.wheels.includes("alloy") ? 0.22 : 0.18;

  const batteryBase: [number, number, number] = [0, 0.5, 0];
  const motorBase: [number, number, number] = [0, 0.28, isMotorcycle ? 0.4 : 0.55];
  const cargoBase: [number, number, number] = [dims.length * 0.25, 0.45, 0];

  const wheelBases: [number, number, number][] = isMotorcycle
    ? [
        [-dims.length * 0.35, dims.wheelY, dims.width],
        [-dims.length * 0.35, dims.wheelY, -dims.width],
        [dims.length * 0.3, dims.wheelY, dims.width],
        [dims.length * 0.3, dims.wheelY, -dims.width],
      ]
    : [
        [-dims.length * 0.32, dims.wheelY, dims.width * 0.45],
        [-dims.length * 0.32, dims.wheelY, -dims.width * 0.45],
        [dims.length * 0.32, dims.wheelY, dims.width * 0.45],
        [dims.length * 0.32, dims.wheelY, -dims.width * 0.45],
      ];

  const highlight = (meshId: string) => {
    if (mode !== "parts") return 1;
    if (selectedPart && meshId === getMeshForPart(selectedPart)) return 1.4;
    if (hoveredPart && meshId === getMeshForPart(hoveredPart)) return 1.2;
    if (selectedPart || hoveredPart) return 0.35;
    return 1;
  };

  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: bodyColor,
        metalness: 0.88,
        roughness: 0.12,
        envMapIntensity: 1.2,
      }),
    [bodyColor]
  );

  useFrame(() => {
    const target = mode === "exploded" ? 1 : 0;
    explodeT.current += (target - explodeT.current) * 0.06;
    const t = explodeT.current;

    batteryRef.current?.position.copy(
      lerp3(batteryBase, EXPLODED_OFFSETS.battery, t)
    );
    motorRef.current?.position.copy(lerp3(motorBase, EXPLODED_OFFSETS.motor, t));
    cargoRef.current?.position.copy(lerp3(cargoBase, EXPLODED_OFFSETS.cargo, t));

    const spread = 1 + t * 0.35;
    wheelBases.forEach((base, i) => {
      const wheel = wheelRefs.current[i];
      if (!wheel) return;
      const zSign = base[2] >= 0 ? 1 : -1;
      const zMag = Math.abs(base[2]) * spread;
      wheel.position.set(base[0], base[1], zSign * zMag);
    });

    if (groupRef.current && mode === "showroom") {
      groupRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]} scale={1.05}>
      <group>
        {isMotorcycle ? (
          <>
            <mesh position={[0, 0.42, 0]} castShadow material={bodyMat}>
              <boxGeometry args={[dims.length * 0.85, dims.height, dims.width]} />
            </mesh>
            <mesh
              position={[-dims.length * 0.15, 0.62, 0]}
              rotation={[0, 0, -0.15]}
              castShadow
              material={bodyMat}
            >
              <boxGeometry args={[dims.length * 0.35, 0.12, dims.width * 0.85]} />
            </mesh>
            <mesh
              position={[dims.length * 0.28, 0.48, 0]}
              rotation={[0, 0, 0.2]}
              castShadow
              material={bodyMat}
            >
              <boxGeometry args={[0.5, 0.15, dims.width * 0.8]} />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[0, 0.38, 0]} castShadow material={bodyMat}>
              <boxGeometry args={[dims.length * 0.9, dims.height * 0.75, dims.width]} />
            </mesh>
            <mesh position={[0.05, 0.82, 0]} castShadow>
              <boxGeometry args={[dims.length * 0.45, dims.height * 0.55, dims.width * 0.88]} />
              <MeshTransmissionMaterial
                backside
                samples={4}
                thickness={0.15}
                chromaticAberration={0.02}
                anisotropy={0.2}
                color="#a8cce8"
                roughness={0}
                transparent
                opacity={config.windows === "tinted" ? 0.7 : 0.92}
              />
            </mesh>
          </>
        )}
      </group>

      <group ref={batteryRef} scale={highlight("battery")}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.18, isMotorcycle ? 0.35 : 0.7]} />
          <meshStandardMaterial
            color="#2d4a3e"
            metalness={0.6}
            roughness={0.35}
            emissive="#1a3d2e"
            emissiveIntensity={
              mode === "parts" && selectedPart?.includes("battery") ? 0.4 : 0.1
            }
          />
        </mesh>
      </group>

      <group ref={motorRef} rotation={[0, 0, Math.PI / 2]} scale={highlight("motor")}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.35, 24]} />
          <meshStandardMaterial color="#444" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {!isMotorcycle && (
        <group ref={cargoRef} scale={highlight("cargo")}>
          <mesh castShadow>
            <boxGeometry args={[dims.length * 0.35, 0.08, dims.width * 0.75]} />
            <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      )}

      {wheelBases.map((base, i) => (
        <group
          key={i}
          ref={(el) => {
            wheelRefs.current[i] = el;
          }}
          position={base}
          scale={highlight("suspension")}
        >
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[dims.wheelR, dims.wheelR, 0.22, 32]} />
            <meshStandardMaterial color="#111" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[wheelStyle, wheelStyle, 0.24, 32]} />
            <meshStandardMaterial
              color="#5a8aad"
              emissive="#5a8aad"
              emissiveIntensity={0.3}
              metalness={1}
              roughness={0.08}
            />
          </mesh>
        </group>
      ))}

      <group scale={highlight("lighting")}>
        <mesh position={[-dims.length * 0.46, 0.42, dims.width * 0.35]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#fff"
            emissiveIntensity={config.lighting === "matrix" ? 4 : 2.5}
          />
        </mesh>
        <mesh position={[-dims.length * 0.46, 0.42, -dims.width * 0.35]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#fff"
            emissiveIntensity={config.lighting === "matrix" ? 4 : 2.5}
          />
        </mesh>
        <mesh position={[dims.length * 0.46, 0.42, dims.width * 0.35]}>
          <boxGeometry args={[0.03, 0.1, 0.22]} />
          <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[dims.length * 0.46, 0.42, -dims.width * 0.35]}>
          <boxGeometry args={[0.03, 0.1, 0.22]} />
          <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={1.5} />
        </mesh>
      </group>

      <mesh position={[0, 0.68, dims.width * 0.48]}>
        <boxGeometry args={[dims.length * 0.7, 0.015, 0.015]} />
        <meshStandardMaterial
          color="#5a8aad"
          emissive="#5a8aad"
          emissiveIntensity={1.5}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {accessoryDefs
        .filter((a) => accessories.includes(a.id))
        .map((acc) => (
          <AccessoryMesh
            key={acc.id}
            type={acc.meshType}
            position={acc.attachPosition}
            scale={acc.attachScale}
          />
        ))}
    </group>
  );
}

function getMeshForPart(partId: string): string {
  if (partId.includes("battery") || partId.includes("charger")) return "battery";
  if (partId.includes("motor") || partId.includes("controller")) return "motor";
  if (partId.includes("brake")) return "brakes";
  if (partId.includes("headlight") || partId.includes("light")) return "lighting";
  if (partId.includes("suspension")) return "suspension";
  return "frame";
}
