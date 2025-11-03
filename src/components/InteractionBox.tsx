// src/components/InteractionBox.tsx
import { Odometer } from "./Odometer";
import { Stage, useExperienceStore } from "../stores/useExperienceStore";
import { useState, memo, useMemo } from "react";
// Importar Edges
import { useCursor, Text, RoundedBox, Float, Edges } from "@react-three/drei";
import { animated, useSpring, config } from "@react-spring/three";
import * as THREE from 'three';

type InteractionType = 'MARGEM' | 'MILHEIRO';

interface InteractionBoxProps {
    position: [number, number, number];
    type: InteractionType;
    requiredStage: Stage;
}

// Cores
const NEON_PURPLE_ACTIVE = "#ffffffff";
const NEON_PURPLE_INACTIVE = "#ffffffff";
const TEXT_COLOR_ACTIVE = "#FFFFFF";
const TEXT_COLOR_INACTIVE = "#ffffffff";
const HOVER_COLOR = "#FFFFFF";

const getColors = (type: InteractionType) => ({
    activeEmissive: NEON_PURPLE_ACTIVE,
    inactiveEmissive: NEON_PURPLE_INACTIVE,
    textActive: TEXT_COLOR_ACTIVE,
    textInactive: TEXT_COLOR_INACTIVE,
    hover: HOVER_COLOR,
});

// Componentes Animados
const AnimatedRoundedBox = animated(RoundedBox);
const AnimatedText = animated(Text);
const AnimatedEdges = animated(Edges); // <<< Componente de Contorno Animado

export const InteractionBox = ({ position, type, requiredStage }: InteractionBoxProps) => {
  const stage = useExperienceStore(state => state.stage);
  const value = useExperienceStore(state => type === 'MARGEM' ? state.margem : state.milheiro);
  const updateValue = useExperienceStore(state => type === 'MARGEM' ? state.setMargem : state.setMilheiro);

  const colors = useMemo(() => getColors(type), [type]);
  const isActive = stage === requiredStage;
  const isPercentage = type === 'MARGEM';

  // Animação de intensidade (para texto e luz interna)
  const { boxEmissiveIntensity, textEmissiveIntensity } = useSpring({
    boxEmissiveIntensity: isActive ? 2.5 : 0.8,
    textEmissiveIntensity: isActive ? 1.0 : 0.4,
    config: { tension: 200, friction: 25 }
  });

  // Animação para a luz roxa interna
  const { lightIntensity } = useSpring({
      lightIntensity: isActive ? 25 : 5, // Mantém a luz interna forte
      config: config.molasses,
      delay: isActive ? 500 : 0
  });

  // MUDANÇA: Animação de cor para o contorno (Edges)
  const edgeColor = useSpring({
    color: isActive ? colors.activeEmissive : colors.inactiveEmissive,
    config: config.stiff
  });

  // Lógica de seleção
  const step = isPercentage ? 1 : 100;
  const minLimit = isPercentage ? 1 : 100;

  const handleIncrement = () => {
    if (!isActive) return;
    updateValue(value + step);
  };

  const handleDecrement = () => {
    if (!isActive) return;
    if (value - step >= minLimit) {
        updateValue(value - step);
    }
  };

  return (
    <group position={position}>
        <Float
            speed={isActive ? 1.5 : 0}
            rotationIntensity={isActive ? 0.05 : 0}
            floatIntensity={isActive ? 0.2 : 0}
        >
            {/* Título */}
            <AnimatedText
                position={[0, 5.5, 0]}
                fontSize={0.5}
                color={isActive ? colors.textActive : colors.textInactive}
                // @ts-ignore
                material-emissiveIntensity={textEmissiveIntensity}
            >
                {isPercentage ? "MARGEM (%)" : "MILHEIRO (UNID.)"}
                <meshStandardMaterial emissive={isActive ? colors.activeEmissive : colors.textActive} color={isActive ? colors.textActive : colors.textInactive} />
            </AnimatedText>

            {/* A "Magic Box" Visual - AGORA ESTILO "CONTORNO" */}
            <AnimatedRoundedBox
                position={[0, 2.5, 0]}
                args={[6.5, 4, 2]}
                radius={0.25}
                smoothness={4}
                // @ts-ignore
                material-emissiveIntensity={boxEmissiveIntensity} // Para a luz interna "vazar"
            >
                {/* Material base INVISÍVEL (sem preenchimento) */}
                <meshPhysicalMaterial
                    transparent={true}
                    opacity={0} // <<< Totalmente transparente
                    emissive={isActive ? colors.activeEmissive : colors.inactiveEmissive} // Mantém a emissão para a luz
                    transmission={0} // Desliga o efeito de vidro
                    metalness={0}
                    roughness={1}
                />
                
                {/* O CONTORNO (Edges) */}
                <AnimatedEdges
                    scale={1.001} // Evita z-fighting
                    threshold={15} // Ângulo para desenhar as bordas
                    // @ts-ignore - Aplica a cor animada ao contorno
                    color={edgeColor.color}
                />
            </AnimatedRoundedBox>

            {/* A LUZ ROXA "SAINDO" DO CARD */}
            <animated.pointLight
                position={[0, 2.5, 0]} // Posição central dentro do card
                color={NEON_PURPLE_ACTIVE}
                intensity={lightIntensity}
                distance={15}
                decay={2}
            />

            {/* O Odômetro 3D (Agora visível dentro do contorno) */}
            <group position={[0, 2.5, 1.1]}>
                <Odometer value={value} isPercentage={isPercentage} />
            </group>

            {/* Botões de Controle 3D */}
            <ControlButton onClick={handleIncrement} position={[4.5, 2.5 + 1.2, 0]} rotation={[0, 0, 0]} active={isActive} colors={colors} />
            <ControlButton onClick={handleDecrement} position={[4.5, 2.5 - 1.2, 0]} rotation={[Math.PI, 0, 0]} active={isActive} colors={colors} />
        </Float>
    </group>
  );
};

// ... (Componente ControlButton permanece o mesmo) ...
const ControlButton = memo(({ onClick, position, rotation, active, colors }: any) => {
    const [hovered, setHovered] = useState(false);
    useCursor(hovered && active);

    const { scale, buttonColor } = useSpring({
        scale: hovered && active ? 1.3 : 1,
        buttonColor: active ? (hovered ? colors.hover : colors.activeEmissive) : colors.inactiveEmissive,
        config: config.stiff,
    });

    return (
        <animated.mesh
            position={position}
            rotation={rotation}
            onClick={(e) => {
                e.stopPropagation();
                if (active) onClick();
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={scale}
            // @ts-ignore
            material-color={buttonColor}
            // @ts-ignore
            material-emissive={buttonColor}
        >
            <coneGeometry args={[0.6, 0.9, 32]} />
            <meshStandardMaterial
                metalness={0.9}
                roughness={0.2}
               emissiveIntensity={0.7}
            />
        </animated.mesh>
    );
});

ControlButton.displayName = "ControlButton";