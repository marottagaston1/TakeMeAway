import React from 'react';

// Pictograma de una hamburguesa vista de costado con N medallones (dibujo, no foto).
export const BurgerStack: React.FC<{readonly patties: number}> = ({patties}) => {
  const bottomBun = 26;
  const patty = 22;
  const cheese = 8;
  const dome = 64;
  const total = bottomBun + patties * (patty + cheese) + dome;
  const H = 200;
  let y = H; // se dibuja de abajo hacia arriba
  const parts: React.ReactNode[] = [];

  y -= bottomBun;
  parts.push(<rect key="bb" x={18} y={y} width={164} height={bottomBun} rx={13} fill="#d9a45a" />);
  for (let i = 0; i < patties; i++) {
    y -= patty;
    parts.push(<rect key={`p${i}`} x={12} y={y} width={176} height={patty} rx={11} fill="#4a2a1a" />);
    y -= cheese;
    parts.push(<rect key={`c${i}`} x={8} y={y} width={184} height={cheese} rx={4} fill="#f2a000" />);
  }
  y -= dome;
  parts.push(
    <path key="td" d={`M16 ${y + dome} Q16 ${y} 100 ${y} Q184 ${y} 184 ${y + dome} Z`} fill="#e3a850" />,
  );
  // chispas de parmesano sobre el pan
  [[60, 22], [90, 14], [124, 24], [150, 38], [44, 42], [104, 40], [76, 50]].forEach(([dx, dy], k) =>
    parts.push(<rect key={`s${k}`} x={dx} y={y + dy} width={14} height={5} rx={2.5} fill="#fff1c9" />),
  );

  return (
    <svg width={200} height={H} viewBox={`0 0 200 ${H}`} role="img" aria-label={`${patties} medallones`}>
      {parts}
      <title>{`${patties} (${total})`}</title>
    </svg>
  );
};
