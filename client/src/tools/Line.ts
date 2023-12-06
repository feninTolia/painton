import { MouseEvent } from 'react';
import Tool from './Tool';

export default class Line extends Tool {
  isMouseDown = false;
  startX: number | null = null;
  startY: number | null = null;
  saved: string = '';

  constructor(canvas: HTMLCanvasElement | null) {
    super(canvas);
    this.listen();
  }

  listen() {
    if (!this.canvas) return;

    // @ts-expect-error CanvasMouseEvent
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    // @ts-expect-error CanvasMouseEvent
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }

  mouseUpHandler() {
    this.isMouseDown = false;
  }
  mouseDownHandler(e: MouseEvent<HTMLCanvasElement>) {
    if (!this.canvas) return;
    this.isMouseDown = true;
    this.startX = e.pageX - e.currentTarget.offsetLeft;
    this.startY = e.pageY - e.currentTarget.offsetTop;
    this.saved = this.canvas.toDataURL();
  }
  mouseMoveHandler(e: MouseEvent<HTMLCanvasElement>) {
    if (this.isMouseDown && this.startX && this.startY) {
      const currentX = e.pageX - e.currentTarget.offsetLeft;
      const currentY = e.pageY - e.currentTarget.offsetTop;

      this.draw(this.startX, this.startY, currentX, currentY);
    }
  }

  draw(x: number, y: number, cx: number, cy: number) {
    if (!this.ctx) return;
    console.log();

    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      if (!this.canvas || !this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(cx, cy);
      this.ctx.stroke();
    };
  }
}
