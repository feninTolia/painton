import { makeAutoObservable } from 'mobx';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';

type ToolType = Brush | Rect | null;

class ToolState {
  tool: ToolType = null;
  constructor() {
    makeAutoObservable(this);
  }

  setTool(tool: ToolType) {
    this.tool = tool;
  }
  setFillColor(color: string) {
    if (!this.tool) return;
    this.tool.fillColor = color;
  }
  setStrokeColor(color: string) {
    if (!this.tool) return;
    this.tool.strokeColor = color;
  }
  setLineWidth(width: number) {
    if (!this.tool) return;
    this.tool.lineWidth = width;
  }
}

export default new ToolState();
