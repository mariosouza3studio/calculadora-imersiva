// src/components/Lighting.tsx
import { useEffect, useRef } from "react";
import { DirectionalLight, AmbientLight, SpotLight } from "three";
import { useExperienceStore } from "../stores/useExperienceStore";
import { gsap } from "gsap";

// Cores e Intensidades para uma Noite Cyberpunk/Tecnológica
const AMBIENT_NIGHT = 0.08; // Mais escuro ainda
const DIRECTIONAL_NIGHT = 0; // Sem luz direcional à noite
const SPOT_NIGHT = 600; // SpotLight mais intenso
const SPOT_NIGHT_COLOR = "#8A2BE2"; // Cor roxa para o spotlight noturno

// Intensidades Finais (Dia CLARO para Celebração) - Sem mudanças aqui
const AMBIENT_DAY = 1.8;
const DIRECTIONAL_DAY = 5;

export const Lighting = () => {
    const directionalLightRef = useRef<DirectionalLight>(null);
    const ambientLightRef = useRef<AmbientLight>(null);
    const spotLightRef = useRef<SpotLight>(null);

    const { stage } = useExperienceStore();

    useEffect(() => {
        const tl = gsap.timeline();

        if (stage === 'END') {
            // Transição para o Dia
            tl.to(ambientLightRef.current, { intensity: AMBIENT_DAY, duration: 3, ease: "power2.out" }, 0);
            tl.to(directionalLightRef.current, { intensity: DIRECTIONAL_DAY, duration: 3, ease: "power2.out" }, 0);
            tl.to(spotLightRef.current, { intensity: 0, duration: 1.5, ease: "power2.out" }, 0);
        } else if (stage === 'START') {
            // Reset para a Noite
            if (ambientLightRef.current) ambientLightRef.current.intensity = AMBIENT_NIGHT;
            if (directionalLightRef.current) directionalLightRef.current.intensity = DIRECTIONAL_NIGHT;
            if (spotLightRef.current) {
                spotLightRef.current.intensity = SPOT_NIGHT;
                spotLightRef.current.color.set(SPOT_NIGHT_COLOR); // Define a cor roxa
            }
        }

        return () => { tl.kill(); }
    }, [stage]);

    return (
        <>
            <ambientLight ref={ambientLightRef} intensity={AMBIENT_NIGHT} color="#ffffff" />
            <directionalLight
                ref={directionalLightRef}
                castShadow
                position={[10, 30, 20]}
                intensity={DIRECTIONAL_NIGHT}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-30}
                shadow-camera-right={30}
                shadow-camera-top={30}
                shadow-camera-bottom={-30}
            />
            <spotLight
                ref={spotLightRef}
                position={[5, 15, 5]}
                angle={0.7}
                penumbra={0.8}
                intensity={SPOT_NIGHT}
                castShadow
                color={SPOT_NIGHT_COLOR} // Cor roxa principal
            />
        </>
    );
}