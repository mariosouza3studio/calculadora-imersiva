// src/components/CameraRig.tsx
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import { PerspectiveCamera } from "@react-three/drei";
import { useExperienceStore } from "../stores/useExperienceStore";
import { useRef } from "react"; // Importar useRef

// Estes são os offsets *relativos* ao personagem
const CAMERA_OFFSET_JOURNEY = { x: 5, y: 4, z: 10 };
const CAMERA_OFFSET_CLIMAX = { x: 0, y: 6, z: 18 }; // Posição final da câmera (mais centralizada e alta)

interface CameraRigProps {
    characterRef: { current: THREE.Group | null };
}

export const CameraRig = ({ characterRef }: CameraRigProps) => {
    const stage = useExperienceStore(state => state.stage);
    const isClimax = stage === 'END';
    const isInteracting = stage === 'AT_MARGIN' || stage === 'AT_MILHEIRO';

    // Vetores para interpolação suave
    const targetPosition = new THREE.Vector3();
    const lookAtTarget = new THREE.Vector3();
    
    // NOVO: Vetor para armazenar o lookAt atual e animá-lo
    const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3());
    const initialized = useRef(false); // Para inicializar o currentLookAt

    useFrame(({ camera }, delta) => {
        if (!characterRef.current) return;

        const characterPosition = characterRef.current.position;

        // 1. Calcular a Posição Alvo da Câmera
        // A câmera ainda se move para uma posição final "Climax"
        const currentOffset = isClimax ? CAMERA_OFFSET_CLIMAX : CAMERA_OFFSET_JOURNEY;
        targetPosition.set(
            characterPosition.x + currentOffset.x,
            characterPosition.y + currentOffset.y,
            characterPosition.z + currentOffset.z
        );

        // 2. Calcular o Ponto Alvo para Onde Olhar (LookAt)
        if (isClimax) {
            // MUDANÇA PRINCIPAL: O alvo é bem alto no céu, acima do personagem
            lookAtTarget.set(characterPosition.x, characterPosition.y + 20, characterPosition.z - 5);
        } else {
            // Durante a jornada, olha para o personagem
            lookAtTarget.set(characterPosition.x, characterPosition.y + 1.5, characterPosition.z);
        }

        // Inicializa o currentLookAt na primeira renderização para evitar saltos
        if (!initialized.current) {
            currentLookAt.current.copy(lookAtTarget);
            initialized.current = true;
        }

        // 3. Calcular Fator de Suavização
        let smoothnessFactor = 4; // Padrão
        if (isClimax) {
            smoothnessFactor = 1.5; // Lento e dramático para o tilt
        } else if (isInteracting) {
            smoothnessFactor = 15; // Rígido
        }
        const smoothness = THREE.MathUtils.damp(0, 1, smoothnessFactor, delta);

        // 4. Aplicar Interpolação (Lerp)
        // Anima a Posição
        camera.position.lerp(targetPosition, smoothness);
        
        // NOVO: Anima o Ponto de "Olhar" (LookAt)
        // Isso cria o efeito de "tilt" suave
        currentLookAt.current.lerp(lookAtTarget, smoothness);
        camera.lookAt(currentLookAt.current);
    });

    return <PerspectiveCamera makeDefault fov={55} />;
}