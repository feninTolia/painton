import { MouseEvent } from 'react';
import Tool from './Tool';

export default class Line extends Tool {
  isMouseDown = false;
  startX: number | null = null;
  startY: number | null = null;
  currentX: number | null = null;
  currentY: number | null = null;
  saved: string = '';

  constructor(
    canvas: HTMLCanvasElement | null,
    socket: WebSocket | null,
    id: string
  ) {
    super(canvas, socket, id);
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
    if (!this.socket) return;
    this.socket.send(
      JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'line',
          x: this.startX,
          y: this.startY,
          currentX: this.currentX,
          currentY: this.currentY,
          color: this.ctx?.fillStyle,
          lineWidth: this.ctx?.lineWidth,
        },
      })
    );
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
      this.currentX = e.pageX - e.currentTarget.offsetLeft;
      this.currentY = e.pageY - e.currentTarget.offsetTop;

      this.draw(this.startX, this.startY, this.currentX, this.currentY);
    }
  }

  draw(x: number, y: number, cx: number, cy: number) {
    if (!this.ctx) return;
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

  static staticDraw(
    ctx: CanvasRenderingContext2D | null | undefined,
    x: number,
    y: number,
    cx: number,
    cy: number,
    color: string,
    lineWidth: number
  ) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
  }
}
