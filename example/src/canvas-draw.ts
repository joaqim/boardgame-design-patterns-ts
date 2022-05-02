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
  // Difference between points of vector
  const dx = tox - fromx;
  const dy = toy - fromy;
  // Angle of vector
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
  // Length of head desired in pixels
  const headlen = 24;
  // Difference between points of vector
  const dx = tox - fromx;
  const dy = toy - fromy;

  // Angle of vector
  const angle = Math.atan2(dy, dx);
  // Pythagora's Theorem to calculate length of vector
  const length = Math.sqrt(dx ** 2 + dy ** 2);

  // Start arrow from half the length
  context.moveTo(
    fromx - (length / 2) * Math.cos(angle + Math.PI),
    fromy - (length / 2) * Math.sin(angle + Math.PI)
  );
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
