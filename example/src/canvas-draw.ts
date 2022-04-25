// https://stackoverflow.com/a/6333775
export function CanvasArrow(
  context: CanvasRenderingContext2D,
  fromx: number,
  fromy: number,
  tox: number,
  toy: number
): void {
  // Length of head in pixels
  const headlen = 24;
  const dx = tox - fromx;
  const dy = toy - fromy;
  const angle = Math.atan2(dy, dx);

  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );
}
export function CanvasHalfArrow(
  context: CanvasRenderingContext2D,
  fromx: number,
  fromy: number,
  tox: number,
  toy: number
): void {
  // Length of head in pixels
  const headlen = 24;
  const dx = tox - fromx;
  const dy = toy - fromy;

  // Shorten arrow length by half
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx ** 2 + dy ** 2);
  fromx -= (length / 2) * Math.cos(angle + Math.PI);
  fromy -= (length / 2) * Math.sin(angle + Math.PI);

  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );
}
