// src/components/Experience.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { World } from "./World";
import { CharacterController } from "./CharacterController";
import { Lighting } from "./Lighting";
import * as THREE from 'three';
import { CameraRig } from "./CameraRig";
import { EffectComposer, Bloom, Vignette, ToneMapping, DepthOfField } from "@react-three/postprocessing";
import { Celebration } from "./Celebration";

export const Experience = () => {
  const characterRef = useRef<THREE.Group>(null);

  return (
    <Canvas
      style={{ height: "100vh", width: "100vw" }}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace
      }}
    >
      <CameraRig characterRef={characterRef} />

      <Suspense fallback={null}>
        <Lighting />
        <World />
        <CharacterController ref={characterRef} />
        <Celebration />
      </Suspense>

      <EffectComposer>
        <ToneMapping
            exposure={1.2} 
        />

        <Bloom
            luminanceThreshold={0.05}
            luminanceSmoothing={0.9}
            intensity={1.5}
            radius={0.7}
            mipmapBlur
        />
        
        <Vignette eskil={false} offset={0.3} darkness={0.1} />

        <DepthOfField
          focusDistance={0}
          focalLength={0.05}
          bokehScale={4}
          height={480}
        />
        
      </EffectComposer>
    </Canvas>
  );
};