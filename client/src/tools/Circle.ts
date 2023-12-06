import { MouseEvent } from 'react';
import Tool from './Tool';

export default class Circle extends Tool {
  isMouseDown = false;
  startX: number | null = null;
  startY: number | null = null;
  width: number | null = null;
  height: number | null = null;
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
          type: 'circle',
          x: this.startX,
          y: this.startY,
          width: this.width,
          height: this.height,
          color: this.ctx?.fillStyle,
        },
      })
    );
  }

  mouseDownHandler(e: MouseEvent<HTMLCanvasElement>) {
    if (!this.canvas) return;

    this.isMouseDown = true;
    this.ctx?.beginPath();
    this.startX = e.pageX - e.currentTarget.offsetLeft;
    this.startY = e.pageY - e.currentTarget.offsetTop;
    this.saved = this.canvas.toDataURL();
  }
  mouseMoveHandler(e: MouseEvent<HTMLCanvasElement>) {
    if (this.isMouseDown && this.startX && this.startY) {
      const currentX = e.pageX - e.currentTarget.offsetLeft;
      const currentY = e.pageY - e.currentTarget.offsetTop;
      this.width = currentX - this.startX;
      this.height = currentY - this.startY;

      this.draw(this.startX, this.startY, this.width, this.height);
    }
  }

  draw(x: number, y: number, w: number, h: number) {
    if (!this.ctx) return;
    const radius = Math.abs(h) / 2 + Math.abs(w) / 2;
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      if (!this.canvas || !this.ctx) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);

      this.ctx.fill();
      this.ctx.stroke();
    };
  }

  static staticDraw(
    ctx: CanvasRenderingContext2D | null | undefined,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ) {
    if (!ctx) return;
    const radius = Math.abs(h) / 2 + Math.abs(w) / 2;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);

    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
  }
}
