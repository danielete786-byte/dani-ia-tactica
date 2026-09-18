/** Original functional pitch diagrams. No Tactics Journal trademark artwork. */
const stroke = '#789582';

function field(x: number, y: number, w: number, h: number): string {
  const mid = x + w / 2;
  const cy = y + h / 2;
  const boxW = w * .16;
  const boxH = h * .54;
  const smallW = w * .052;
  const smallH = h * .25;
  const radius = Math.min(w, h) * .12;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e9f0e7"/>
    <g fill="#dfe9dc" opacity=".58">${[0, 2, 4, 6, 8].map(i => `<rect x="${x + w * i / 10}" y="${y}" width="${w / 10}" height="${h}"/>`).join('')}</g>
    <g stroke="${stroke}" stroke-width="1.65" fill="none">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1"/>
      <path d="M${mid} ${y}v${h}"/><circle cx="${mid}" cy="${cy}" r="${radius}"/>
      <path d="M${x} ${cy-boxH/2}h${boxW}v${boxH}h${-boxW}M${x+w} ${cy-boxH/2}h${-boxW}v${boxH}h${boxW}"/>
      <path d="M${x} ${cy-smallH/2}h${smallW}v${smallH}h${-smallW}M${x+w} ${cy-smallH/2}h${-smallW}v${smallH}h${smallW}"/>
      <path d="M${x} ${cy-smallH/4}h-7v${smallH/2}h7M${x+w} ${cy-smallH/4}h7v${smallH/2}h-7"/>
    </g><g fill="${stroke}"><circle cx="${mid}" cy="${cy}" r="2"/><circle cx="${x+w*.11}" cy="${cy}" r="1.7"/><circle cx="${x+w*.89}" cy="${cy}" r="1.7"/></g>`;
}

function svg(height: number, drawing: string): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${height}" viewBox="0 0 800 ${height}">
    <rect width="800" height="${height}" fill="#faf8f0"/>
    ${drawing}
    <text x="28" y="${height-12}" fill="#907238" font-family="Arial,sans-serif" font-size="8" letter-spacing="2">DANIA TÁCTICA · PIZARRA DE FÚTBOL</text>
  </svg>`);
}

const vertical = `<rect x="138" y="30" width="628" height="576" fill="#e9f0e7"/>
  <g fill="none" stroke="${stroke}" stroke-width="1.8">
  <rect x="138" y="30" width="628" height="576"/>
  <path d="M138 606h628M452 606m-80 0a80 80 0 0 1 160 0M285 30v160h334V30M371 30v58h162V30M407 30V20h90v10"/>
  <circle cx="452" cy="154" r="2" fill="${stroke}"/>
  </g>`;

export const daniaPitches = {
  pitch: svg(618, field(28, 32, 666, 550)),
  vertical: svg(640, vertical),
  training: svg(418, field(28, 28, 666, 362)),
  sidebyside: svg(533, field(20, 28, 345, 469) + field(435, 28, 345, 469)),
  classic: svg(418, field(28, 28, 666, 362)),
  session: svg(640, ''),
};
