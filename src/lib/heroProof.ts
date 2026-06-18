// Responsive sizing for the hero before/after proof image. Shared between Hero.astro
// (which renders the <Image>) and index.astro (which preloads it as the LCP element), so
// the preloaded srcset stays byte-identical to what actually renders — no double download.
export const proofWidths = [420, 760, 1100];
export const proofSizes = '(max-width: 900px) 92vw, 560px';
