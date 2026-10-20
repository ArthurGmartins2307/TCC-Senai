/**
 * Fato ou Farsa - Identidade Visual Oficial (Ícone Oficial)
 * Conforme instrução do usuário:
 * - O nome "Fato ou Farsa" foi removido da logo, exibindo EXCLUSIVAMENTE o ícone oficial
 * - Proporções originais, detalhes e cores (olho estilizado com balões de fala e íris com check dourado) preservados
 * - Formato transparente e de alta resolução para nitidez em qualquer dispositivo
 */

import React from 'react';

export interface LogoIconProps {
  className?: string;
  size?: number;
  altText?: string;
  variant?: 'clean' | 'original-crop';
}

export const LogoIcon: React.FC<LogoIconProps> = ({
  className = '',
  size = 40,
  altText = 'Fato ou Farsa — Ícone Oficial',
  variant = 'clean',
}) => {
  const src =
    variant === 'original-crop'
      ? '/assets/aistudio/fato_ou_farsa_icon.png'
      : '/assets/aistudio/fato_ou_farsa_icon_clean.png';

  return (
    <img
      src={src}
      alt={altText}
      style={{ height: `${size}px`, width: 'auto' }}
      className={`shrink-0 object-contain select-none transition-transform ${className}`}
      loading="eager"
      decoding="async"
    />
  );
};

export interface LogoProps {
  layout?: 'icon-only';
  iconSize?: number;
  className?: string;
  variant?: 'clean' | 'original-crop';
}

/**
 * Componente Logo unificado:
 * Exibe unicamente o ícone oficial conforme solicitação direta:
 * "tire o nome fato ou farsa da logo, e deixe só o ícone"
 */
export const Logo: React.FC<LogoProps> = ({
  iconSize = 42,
  className = '',
  variant = 'clean',
}) => {
  return <LogoIcon size={iconSize} className={className} variant={variant} />;
};

export default Logo;
