// https://stackoverflow.com/a/6333775
export function canvas_arrow(
  context: CanvasRenderingContext2D,
  fromx: number,
  fromy: number,
  tox: number,
  toy: number
) {
  // Length of head in pixels
  var headlen = 24;
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);

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
export function canvas_half_arrow(
  context: CanvasRenderingContext2D,
  fromx: number,
  fromy: number,
  tox: number,
  toy: number
) {
  // Length of head in pixels
  var headlen = 24;
  var dx = tox - fromx;
  var dy = toy - fromy;

  // Shorten arrow length by half
  var angle = Math.atan2(dy, dx);
  var length: number = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
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