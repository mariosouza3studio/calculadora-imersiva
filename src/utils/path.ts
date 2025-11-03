// src/utils/path.ts
import * as THREE from "three";
import { Stage } from "../stores/useExperienceStore";

// Definindo os pontos chave (X, Y, Z). Z negativo é "para frente".
export const PATH_POINTS = {
  START: new THREE.Vector3(0, 0, 5),       // Ponto Inicial
  AT_MARGIN: new THREE.Vector3(0, 0, -20),     // Ponto de parada 1
  AT_MILHEIRO: new THREE.Vector3(2, 0, -45), // Ponto de parada 2 (leve curva)
  END: new THREE.Vector3(2, 0, -60),     // Ponto final
};

const points = [
    PATH_POINTS.START,
    PATH_POINTS.AT_MARGIN,
    PATH_POINTS.AT_MILHEIRO,
    PATH_POINTS.END,
];

// Cria a curva suave que passa por todos os pontos.
export const journeyCurve = new THREE.CatmullRomCurve3(points);

// Mapeamento entre os estágios e o progresso na curva (0 a 1).
// Com 4 pontos, temos 3 segmentos. O Three.js parametriza a curva para que os pontos
// de controle estejam localizados em frações uniformes.
const SEGMENTS = points.length - 1; // 3 segmentos

export const STAGE_PROGRESS: Record<Stage, number> = {
    START: 0,
    AT_MARGIN: 1 / SEGMENTS,   // (1/3)
    AT_MILHEIRO: 2 / SEGMENTS, // (2/3)
    END: 1,
};