// src/components/CharacterModel.tsx
import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from 'three';

// Nomes das animações que existem neste arquivo GLB específico.
const ANIMATIONS = {
    WALK: 'Walking', // Este modelo usa 'Walking' para a caminhada padrão.
    IDLE: 'Idle',
};

const MODEL_PATH = '/models/RobotExpressive.glb';

export const CharacterModel = ({ isWalking = false }) => {
  // Carrega o modelo e suas animações
  const { scene, animations } = useGLTF(MODEL_PATH);
  // Conecta as animações ao modelo carregado
  const { actions } = useAnimations(animations, scene);

  // 1. Configuração de Sombras e Otimização
  // Executado uma vez quando o modelo carrega (quando 'scene' está disponível).
  useEffect(() => {
    if (scene) {
        // Percorre todos os objetos filhos do modelo
        scene.traverse((child) => {
            // Garante que todas as partes do modelo projetem e recebam sombras
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }
  }, [scene]);

  // 2. Sistema de Controle de Animação
  useEffect(() => {
    // Determina qual animação tocar baseado na propriedade isWalking
    const actionName = isWalking ? ANIMATIONS.WALK : ANIMATIONS.IDLE;
    const action = actions[actionName];

    if (action) {
      // Transição suave (crossfade): Reseta, fadeIn em 0.3s e toca.
      action.reset().fadeIn(0.3).play();

      // Função de limpeza (executada antes do próximo useEffect quando isWalking muda)
      return () => {
        // fadeOut em 0.3s.
        action.fadeOut(0.3);
      };
    }
  }, [isWalking, actions]);

  // Ajustes específicos do modelo
  return (
    <group dispose={null}>
        {/* Usamos 'primitive' para renderizar a cena carregada do GLTF */}
        <primitive
            object={scene}
            // O Robô é grande, ajustamos a escala e a posição Y para alinhá-lo ao chão
            scale={0.6}
            position={[0, 0.05, 0]}
        />
    </group>
  );
};

// Pré-carregamento do modelo para melhor performance
useGLTF.preload(MODEL_PATH);