// src/utils/calculator.ts

// Placeholder para o preço base. Ajuste isso conforme a lógica real do seu negócio.
const PRECO_UNITARIO_BASE = 5.00;

interface CalculationParams {
  milheiro: number;
  margem: number;
}

export const calculateCommission = ({ milheiro, margem }: CalculationParams): number => {
  // Exemplo de Cálculo: (Unidades * Preço Base) * (Margem / 100)
  const valorTotalPedido = milheiro * PRECO_UNITARIO_BASE;
  const comissao = valorTotalPedido * (margem / 100);

  // Retorna o valor arredondado para duas casas decimais
  return parseFloat(comissao.toFixed(2));
};