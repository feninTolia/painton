import Brush from './Brush';

export default class Eraser extends Brush {
  constructor(canvas: HTMLCanvasElement | null) {
    super(canvas);
  }

  draw(x: number, y: number) {
    if (!this.ctx) return;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.strokeStyle = '#1c1c1c';
  }
}
