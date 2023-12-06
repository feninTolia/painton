import { MouseEvent } from 'react';
import Tool from './Tool';

export default class Brush extends Tool {
  isMouseDown = false;

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
  mouseMoveHandler(e: MouseEvent<HTMLCanvasElement>) {
    if (this.isMouseDown) {
      this.draw(
        e.pageX - e.currentTarget.offsetLeft,
        e.pageY - e.currentTarget.offsetTop
      );

      this.socket?.send(
        JSON.stringify({
          method: 'draw',
          id: this.id,
          figure: {
            type: 'brush',
            x: e.pageX - e.currentTarget.offsetLeft,
            y: e.pageY - e.currentTarget.offsetTop,
          },
        })
      );
    }
  }
  mouseUpHandler() {
    this.isMouseDown = false;
    this.socket?.send(
      JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'finish',
        },
      })
    );
  }
  mouseDownHandler(e: MouseEvent<HTMLCanvasElement>) {
    this.isMouseDown = true;
    this.ctx?.beginPath();

    this.ctx?.moveTo(
      e.pageX - e.currentTarget.offsetLeft,
      e.pageY - e.currentTarget.offsetTop
    );
  }

  draw(x: number, y: number) {
    this.ctx?.lineTo(x, y);
    this.ctx?.stroke();
  }

  static staticDraw(
    ctx: CanvasRenderingContext2D | null | undefined,
    x: number,
    y: number
  ) {
    ctx?.lineTo(x, y);
    ctx?.stroke();
  }
}
