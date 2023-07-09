export function init2DCanvas() {
  /** @type {HTMLCanvasElement} canvas2D */
  const canvas2D = document.getElementById("2d");
  const ctx = canvas2D.getContext("2d");
  const { height, width } = canvas2D.getClientRects()[0];

  const { x, y } = { x: Math.floor(width / 2), y: Math.floor(height / 2) };

  ctx.fillStyle = "hsl(318, 90%, 85%)";
  ctx.beginPath();
  ctx.moveTo(x, y - 35);
  ctx.lineTo(x - 70, y + 35);
  ctx.lineTo(x + 70, y + 35);
  ctx.fill();
}
