import Brush from './Brush';

export default class Eraser extends Brush {
  constructor(
    canvas: HTMLCanvasElement | null,
    socket: WebSocket | null,
    id: string
  ) {
    super(canvas, socket, id);
  }

  draw(x: number, y: number) {
    if (!this.ctx) return;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.strokeStyle = '#1c1c1c';
    this.ctx.fillStyle = '#1c1c1c';
  }
}
