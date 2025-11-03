// src/components/Interface.tsx
"use client";
import { useExperienceStore } from "../stores/useExperienceStore";

export const Interface = () => {
  const { stage, advanceStage, reset } = useExperienceStore();

  return (
    // 'fixed': Garante que a interface fique sobreposta à cena 3D.
    // 'z-10': Garante que esteja acima do Canvas.
    <div className="fixed bottom-0 left-0 p-16 w-full flex justify-center gap-4 z-10">

      {/* Botão de Avanço (renderiza condicionalmente, exceto no final) */}
      {stage !== 'END' && (
        <button
            onClick={advanceStage}
            // Estilo profissional e interativo com Tailwind
            className="font-bold py-2 px-10 rounded-full shadow-xl transition duration-300 ease-in-out transform hover:scale-105 bg-transparent border-2 border-purple-500 text-purple-500 cursor-pointer"
        >
          {/* Texto dinâmico baseado no estágio */}
          {stage === 'START' && "Iniciar Jornada"}
          {stage === 'AT_MARGIN' && "Confirmar Margem"}
          {stage === 'AT_MILHEIRO' && "Calcular Comissão"}
        </button>
      )}

       {/* Botão de Reset (renderiza no final) */}
       {stage === 'END' && (
        <button
            onClick={reset}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
        >
          Calcular Novamente
        </button>
      )}

       {/* Informação de Debug (Opcional, mas útil) */}
       <div className="absolute bottom-4 left-4 text-white bg-black/50 p-2 rounded text-xs">
        Stage Atual: {stage}
      </div>
    </div>
  );
};