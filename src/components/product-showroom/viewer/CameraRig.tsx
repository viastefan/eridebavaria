"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_PRESETS } from "@/lib/showroom-data";
import type { CameraView } from "@/lib/showroom-types";

export function CameraRig({ view }: { view: CameraView }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3(0, 0.4, 0));

  useEffect(() => {
    const preset = CAMERA_PRESETS[view] ?? CAMERA_PRESETS.exterior;
    targetPos.current.set(...preset.position);
    targetLook.current.set(...preset.target);
  }, [view]);

  useFrame((_, delta) => {
    const damp = 1 - Math.pow(0.001, delta);
    camera.position.lerp(targetPos.current, damp * 0.08);
    currentLook.current.lerp(targetLook.current, damp * 0.08);
    camera.lookAt(currentLook.current);
  });

  return null;
}
