// src/components/CharacterController.tsx
import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { journeyCurve, STAGE_PROGRESS } from "../utils/path";
import { useExperienceStore } from "../stores/useExperienceStore";
import { CharacterModel } from "./CharacterModel"; 

export const CharacterController = forwardRef<Group>((props, ref) => {
  const internalGroupRef = useRef<Group>(null);
  useImperativeHandle(ref, () => internalGroupRef.current!);

  const stage = useExperienceStore(state => state.stage);
  const progress = useRef({ value: 0 });

  const [isWalking, setIsWalking] = useState(false);

  // ... (useEffect e useFrame permanecem os mesmos) ...
  useEffect(() => {
    const targetProgress = STAGE_PROGRESS[stage];
    const duration = Math.abs(targetProgress - progress.current.value) * 15;

    if (duration < 0.1) {
        progress.current.value = targetProgress;
        setIsWalking(false);
        return;
    }

    const tl = gsap.timeline({
        onStart: () => {
            setIsWalking(true);
        },
        onComplete: () => {
            setIsWalking(false);
        }
    });

    tl.to(progress.current, {
      value: targetProgress,
      duration: duration,
      ease: "power2.inOut",
    });

    return () => { tl.kill(); }
  }, [stage]);

  useFrame(() => {
    if (!internalGroupRef.current) return;

    const currentProgress = progress.current.value;

    const point = journeyCurve.getPointAt(currentProgress);
    internalGroupRef.current.position.copy(point);

    const lookAheadProgress = Math.min(currentProgress + 0.001, 1);
    if (lookAheadProgress < 1) {
        const tangent = journeyCurve.getPointAt(lookAheadProgress);
        const lookAtTarget = point.clone().add(tangent);
        internalGroupRef.current.lookAt(lookAtTarget);
    }
  });

  return (
    <group ref={internalGroupRef} dispose={null}>
      <CharacterModel isWalking={isWalking} />
      <pointLight
        position={[0, 1.5, 0.5]}
        intensity={0.6} // <<< MUDANÇA: Aumentado de 0.5 para 1.5
        distance={5} // <<< MUDANÇA: Aumentado de 5 para 6
        decay={2}
        color="#B886F0"
      />
    </group>
  );
});

CharacterController.displayName = "CharacterController";