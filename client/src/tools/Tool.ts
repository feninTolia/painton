export default class Tool {
  canvas: HTMLCanvasElement | null = null;
  socket;
  id;
  ctx;

  constructor(
    canvas: HTMLCanvasElement | null,
    socket: WebSocket | null,
    id: string
  ) {
    this.canvas = canvas;
    this.socket = socket;
    this.id = id;

    this.ctx = canvas?.getContext('2d');
    this.destroyEvents();
  }

  set fillColor(color: string) {
    if (!this.ctx) return;
    this.ctx.fillStyle = color;
  }
  set strokeColor(color: string) {
    if (!this.ctx) return;
    this.ctx.strokeStyle = color;
  }
  set lineWidth(width: number) {
    if (!this.ctx) return;
    this.ctx.lineWidth = width;
  }

  destroyEvents() {
    if (!this.canvas) return;

    this.canvas.onmousemove = null;
    this.canvas.onmousedown = null;
    this.canvas.onmouseup = null;
  }
}
