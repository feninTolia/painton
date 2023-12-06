import { makeAutoObservable } from 'mobx';

class CanvasState {
  canvas: HTMLCanvasElement | null = null;
  undoList: string[] = [];
  redoList: string[] = [];
  username = '';
  socket: WebSocket | null = null;
  sessionId = '';

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(username: string) {
    this.username = username;
  }
  setSocket(socket: WebSocket) {
    this.socket = socket;
  }
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  setCanvas(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas;
  }

  pushToUndo(data: string) {
    this.undoList.push(data);
  }

  pushToRedo(data: string) {
    this.redoList.push(data);
  }

  undo() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');

    if (this.undoList.length > 0) {
      const dataUrl = this.undoList.pop() ?? '';
      this.redoList.push(this.canvas.toDataURL());
      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        if (!this.canvas || !ctx) return;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    } else {
      ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  redo() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');

    if (this.redoList.length > 0) {
      const dataUrl = this.redoList.pop() ?? '';
      this.undoList.push(this.canvas.toDataURL());
      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        if (!this.canvas || !ctx) return;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    }
  }
}

export default new CanvasState();
