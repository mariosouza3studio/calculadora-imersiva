// src/stores/useExperienceStore.ts
import { create } from 'zustand';
import { calculateCommission } from '../utils/calculator'; // Importar a calculadora

export type Stage = 'START' | 'AT_MARGIN' | 'AT_MILHEIRO' | 'END';

interface ExperienceState {
  stage: Stage;
  margem: number;
  milheiro: number;
  comissao: number; // Adicionado para armazenar o resultado

  setMargem: (value: number) => void;
  setMilheiro: (value: number) => void;
  advanceStage: () => void;
  reset: () => void;
}

const INITIAL_STATE = {
    stage: 'START' as Stage,
    margem: 20,
    milheiro: 1000,
    comissao: 0, // Inicializa a comissão
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  ...INITIAL_STATE,

  setMargem: (value) => set({ margem: value }),
  setMilheiro: (value) => set({ milheiro: value }),

  advanceStage: () => {
    const currentStage = get().stage;
    switch (currentStage) {
      case 'START':
        set({ stage: 'AT_MARGIN' });
        break;
      case 'AT_MARGIN':
        set({ stage: 'AT_MILHEIRO' });
        break;
      case 'AT_MILHEIRO':
        // Calcula a comissão e avança para o END
        const { margem, milheiro } = get();
        const comissaoCalculada = calculateCommission({ margem, milheiro });
        set({ stage: 'END', comissao: comissaoCalculada });
        break;
    }
  },
  reset: () => set(INITIAL_STATE),
}));