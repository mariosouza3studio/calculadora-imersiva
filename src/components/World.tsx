// src/components/World.tsx
import { Stars, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { InteractionBox } from "./InteractionBox";
import { PATH_POINTS } from "../utils/path";
import { useEffect, useRef, useMemo } from "react";
import { useExperienceStore } from "../stores/useExperienceStore";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";

// Novas cores para um ambiente noturno mais dark e roxo
const NIGHT_COLOR = new THREE.Color("rgba(13, 0, 26, 1)"); // Quase preto, com um toque roxo
const DAY_COLOR = new THREE.Color("#87CEFA"); // Mantém o azul claro do dia
const FOG_COLOR_NIGHT = new THREE.Color("#100018"); // Neblina roxa escura
const FOG_DENSITY_NIGHT = 0.015;
const FOG_DENSITY_DAY = 0.002;

export const World = () => {
  const stage = useExperienceStore(state => state.stage);
  const { scene } = useThree();
  const starsRef = useRef<any>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    if (stage === 'END') {
        tl.to(scene.background, { r: DAY_COLOR.r, g: DAY_COLOR.g, b: DAY_COLOR.b, duration: 3 }, 0);
        if (scene.fog) {
            tl.to(scene.fog.color, { r: DAY_COLOR.r, g: DAY_COLOR.g, b: DAY_COLOR.b, duration: 3 }, 0);
            // @ts-ignore
            tl.to(scene.fog, { density: FOG_DENSITY_DAY, duration: 3 }, 0);
        }
    } else if (stage === 'START') {
        scene.background = NIGHT_COLOR.clone();
        if (scene.fog) {
            scene.fog.color = FOG_COLOR_NIGHT.clone(); // Usa a cor roxa escura para a neblina
            // @ts-ignore
            scene.fog.density = FOG_DENSITY_NIGHT;
        }
        if (starsRef.current) {
            starsRef.current.material.opacity = 1;
        }
    }
    return () => { tl.kill(); }
  }, [stage, scene]);

  const marginPosition: [number, number, number] = [PATH_POINTS.AT_MARGIN.x - 4.5, 0, PATH_POINTS.AT_MARGIN.z];
  const milheiroPosition: [number, number, number] = [PATH_POINTS.AT_MILHEIRO.x + 4.5, 0, PATH_POINTS.AT_MILHEIRO.z];

  return (
    <>
      <color attach="background" args={[NIGHT_COLOR.getHex()]} />
      <fogExp2 attach="fog" args={[FOG_COLOR_NIGHT.getHex(), FOG_DENSITY_NIGHT]} /> {/* Usa a nova cor para a neblina */}
      <Stars ref={starsRef} radius={150} depth={60} count={4000} factor={8} saturation={0} fade speed={0.5} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <MeshReflectorMaterial
            resolution={1024}
            mixBlur={1}
            mixStrength={1.5}
            roughness={0.8}
            metalness={0.1}
            color="#080808" // Chão quase preto para combinar com os cards
            mirror={0.75}
        />
      </mesh>

      <InteractionBox position={marginPosition} type="MARGEM" requiredStage="AT_MARGIN" />
      <InteractionBox position={milheiroPosition} type="MILHEIRO" requiredStage="AT_MILHEIRO" />

      <MysteriousForest />
    </>
  );
};

// --- MysteriousForest (ajustando os materiais para o tema roxo/escuro) ---
const MysteriousForest = () => {
    const COUNT = 40;

    const trunkMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#100018", // Troncos mais escuros, quase pretos com toque roxo
        roughness: 0.8,
        metalness: 0.3,
        emissive: "#05000A", // Emissão muito sutil
        flatShading: true,
      }), []);
    
    const crystalMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#B886F0", // Cristais com um roxo mais forte
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.8,
        ior: 1.7,
        emissive: "#8A2BE2", // Emissão roxa mais clara
        emissiveIntensity: 0.3, // Aumenta a emissão para um brilho sutil
        flatShading: false,
      }), []);

    const items = useMemo(() => {
// ... (restante do código igual)
        return [...Array(COUNT)].map((_, i) => {
          const side = i % 2 === 0 ? 1 : -1;
          const x = side * (Math.random() * 15 + 10);
          const z = -i * 5 - (Math.random() * 5);
          const scale = 1 + Math.random() * 1.5;
          const rotationY = Math.random() * Math.PI * 2;
          const trunkHeight = (1 + Math.random()) * 2;

          return {
            key: i,
            position: [x, 0, z] as [number, number, number],
            scale: scale,
            rotationY: rotationY,
            trunkHeight: trunkHeight,
          };
        });
      }, []);

    return (
      <group>
        {items.map((item) => (
          <group
            key={item.key}
            position={item.position}
            rotation-y={item.rotationY}
            scale={item.scale}
          >
            <mesh
              castShadow
              receiveShadow
              material={trunkMaterial}
              position-y={item.trunkHeight / 2}
            >
              <cylinderGeometry args={[0.15, 0.2, item.trunkHeight, 8]} />
            </mesh>
            <mesh
              castShadow
              material={crystalMaterial}
              position-y={item.trunkHeight + 0.8}
            >
              <icosahedronGeometry args={[1.2, 1]} />
            </mesh>
          </group>
        ))}
      </group>
    );
  };