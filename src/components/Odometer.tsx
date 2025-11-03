// src/components/Odometer.tsx
import { Text, Mask, useMask } from "@react-three/drei";
import { useSpring, animated, config } from "@react-spring/three";
import { useEffect, useState, useRef, useCallback } from "react";
import * as THREE from 'three';

// URL direta do Google Fonts para Roboto Mono (fonte monoespaçada)

interface OdometerProps {
  value: number;
  isPercentage?: boolean;
}

const FONT_SIZE = 1.4;
const HEIGHT = FONT_SIZE * 1.1;

export const Odometer = ({ value, isPercentage = false }: OdometerProps) => {
  const format = useCallback((val: number) => {
    return isPercentage ? `${val}%` : val.toLocaleString('pt-BR');
  }, [isPercentage]);

  const [displayValue, setDisplayValue] = useState(format(value));
  const [direction, setDirection] = useState(0);
  const previousValueRef = useRef(value);
  const stencil = useMask(1);

  useEffect(() => {
    if (value !== previousValueRef.current) {
        const newDirection = value > previousValueRef.current ? 1 : -1;
        setDirection(newDirection);
        setDisplayValue(format(value));
        previousValueRef.current = value;
    }
  }, [value, format]);

  // Animação de rolagem
  const { y } = useSpring({
    from: { y: -direction * HEIGHT },
    to: { y: 0 },
    reset: true,
    // AJUSTE DE FLUIDEZ: 'stiff' é rápido, preciso e satisfatório.
    config: config.stiff,
  });

  return (
    <group>
      <Mask id={1} position={[0, 0, 0.01]}>
        <planeGeometry args={[10, HEIGHT]} />
      </Mask>

      <animated.group position-y={y}>
        <Text
          fontSize={FONT_SIZE}
          anchorX="center"
          anchorY="middle"
        >
          {displayValue}

          <meshStandardMaterial
              color="white"
              emissive="white"
              emissiveIntensity={0.8}
              toneMapped={true}
              side={THREE.DoubleSide}
              {...stencil}
            />
        </Text>
      </animated.group>
    </group>
  );
};