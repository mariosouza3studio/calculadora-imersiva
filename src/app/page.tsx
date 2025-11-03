// src/app/page.tsx
import { Experience } from "../components/Experience";
import { Interface } from "../components/Interface"; // Certifique-se de que está importado

export default function Home() {
  return (
    <main>
      {/* O Canvas 3D */}
      <Experience />
      {/* A Interface de Usuário (Botões) */}
      <Interface />
    </main>
  );
}