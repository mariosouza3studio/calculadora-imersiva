// src/components/Celebration.tsx
import { useExperienceStore } from "../stores/useExperienceStore";
import { Center, Float, Text3D } from "@react-three/drei";
import { PATH_POINTS } from "../utils/path";
import { animated, useSpring, config } from "@react-spring/three";
import * as THREE from 'three'; // Importar THREE

const FONT_PATH = "/fonts/Inter_Bold.json"; // Ou a fonte Geist Mono se você preferir

// NOVA COR DA CELEBRAÇÃO: Roxo Neon/Vibrante
const CELEBRATION_COLOR = "#FFFFFF"; // Texto branco puro para contraste máximo
const CELEBRATION_EMISSIVE_COLOR = "#8A2BE2"; // Roxo forte para a emissão interna
const OUTLINE_COLOR = "#E0BBE4"; // Um roxo neon claro para o contorno

export const Celebration = () => {
  const { stage, comissao } = useExperienceStore();

  // Formatação do valor (Moeda Brasileira)
  const formattedCommission = comissao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Animação de aparição (escala e intensidade do brilho)
  const { scale, intensity } = useSpring({
    scale: stage === 'END' ? 1.5 : 0, // Aumentei o tamanho final para 1.5
    intensity: stage === 'END' ? 3.5 : 0, // Aumentei bastante a intensidade da emissão
    delay: 1500, // Delay para que a câmera e o ambiente tenham tempo de transição
    config: config.wobbly, // Efeito vibrante e celebratório
  });

  // Posição final no céu
  const position: [number, number, number] = [
    PATH_POINTS.END.x,
    18, // Alto no céu
    PATH_POINTS.END.z - 10
  ];

  return (
    <animated.group position={position} scale={scale}>
        {/* Float adiciona um movimento sutil e elegante */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Center>
                <Text3D
                    font={FONT_PATH}
                    size={3.5} // Aumentei o tamanho para 3.5
                    height={0.6} // Profundidade do texto 3D um pouco maior
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={0.15} // Contorno mais grosso
                    bevelSize={0.08}     // Contorno mais visível
                    bevelOffset={0}
                    // @ts-ignore - Propriedade para controlar a cor do bevel
                    bevelSegments={5}     // Suaviza o bevel
                >
                    {formattedCommission}
                    {/* Material do Texto: Metálico, Brilhante com Contorno */}
                    <animated.meshPhysicalMaterial
                        color={CELEBRATION_COLOR} // Cor base do texto (branco)
                        emissive={CELEBRATION_EMISSIVE_COLOR} // Cor da emissão (roxo)
                        metalness={0.9} // Bem metálico
                        roughness={0.1} // Bem liso/brilhante
                        clearcoat={1} // Adiciona uma camada de brilho
                        clearcoatRoughness={0.1}
                        // @ts-ignore - Ignorando erro de tipo do spring no emissiveIntensity
                        emissiveIntensity={intensity}
                    />
                    {/* Material do Bevel (Contorno) */}
                    <meshStandardMaterial
                        attach="bevel" // Aplica este material especificamente ao bevel
                        color={OUTLINE_COLOR}
                        emissive={OUTLINE_COLOR}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </Text3D>
            </Center>
        </Float>
    </animated.group>
  );
};