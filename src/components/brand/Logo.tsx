/**
 * Fato ou Farsa - Identidade Visual e Logotipo Oficial
 * Baseado fielmente no asset FatoOuFarsa.jpeg fornecido
 * - Símbolo: Olho formado por balões de diálogo sobrepostos (azul marinho e verde esmeralda)
 *   com íris azul, reflexo de luz e tique dourado de verificação.
 * - Tipografia: "Fato" (azul marinho), "ou" (amarelo ouro), "Farsa" (verde esmeralda).
 */

import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Ícone Fato ou Farsa"
    >
      {/* Balão Superior Esquerdo (Azul Marinho) */}
      <path
        d="M 50 12 C 30 12 14 24 10 38 C 18 42 28 46 40 48 C 30 44 23 37 25 32 C 28 24 40 18 53 18 C 65 18 73 23 79 30 C 74 21 63 12 50 12 Z"
        fill="#003876"
      />
      <path
        d="M 12 36 C 24 18 44 14 62 14 C 44 20 28 32 23 48 L 16 54 L 20 44 C 15 42 13 39 12 36 Z"
        fill="#003876"
      />

      {/* Arco Superior / Esquerdo contínuo */}
      <path
        d="M 50 14 C 28 14 14 28 12 38 C 14 42 17 48 24 48 L 18 56 L 30 50 C 40 52 48 49 52 46 C 40 46 29 40 25 33 C 22 25 36 18 50 18 C 62 18 72 23 78 30 C 73 21 62 14 50 14 Z"
        fill="#003876"
      />

      {/* Arco Inferior / Direito (Verde Esmeralda) com cauda à direita */}
      <path
        d="M 50 66 C 72 66 86 52 88 42 C 86 38 83 32 76 32 L 82 24 L 70 30 C 60 28 52 31 48 34 C 60 34 71 40 75 47 C 78 55 64 62 50 62 C 38 62 28 57 22 50 C 27 59 38 66 50 66 Z"
        fill="#00A86B"
      />

      {/* Íris Central (Azul Profundo) */}
      <circle cx="50" cy="40" r="17" fill="#002D62" />

      {/* Reflexo de Luz na Pupila (Branco) */}
      <circle cx="43" cy="34" r="3.2" fill="#FFFFFF" />

      {/* Marca de Verificação / Checkmark (Amarelo Dourado) */}
      <path
        d="M 42 41.5 L 47.5 47 L 58.5 35.5"
        stroke="#F5B800"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface LogoProps {
  layout?: 'horizontal' | 'vertical' | 'icon-only';
  iconSize?: number;
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  layout = 'horizontal',
  iconSize = 34,
  className = '',
  showSubtitle = false,
}) => {
  if (layout === 'icon-only') {
    return <LogoIcon size={iconSize} className={className} />;
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${
        layout === 'vertical' ? 'flex-col text-center' : 'flex-row'
      } ${className}`}
    >
      <LogoIcon size={iconSize} />
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline font-extrabold tracking-tight font-sans text-xl sm:text-2xl">
          <span className="text-[#003876] dark:text-[#38bdf8]">Fato</span>
          <span className="text-[#F5B800] px-1 text-[0.88em]">ou</span>
          <span className="text-[#00A86B] dark:text-[#34d399]">Farsa</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-medium tracking-wide text-slate-500 dark:text-slate-400 mt-1 uppercase font-mono">
            Verificação de Conteúdos
          </span>
        )}
      </div>
    </div>
  );
};
