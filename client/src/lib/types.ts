export interface IWSMsg {
  id: string;
  username: string;
  method: 'connection' | 'draw';
  figure: {
    type: 'brush' | 'rect' | 'circle' | 'line' | 'finish';
    x: number;
    y: number;
    currentX: number;
    currentY: number;
    width: number;
    height: number;
    color: string;
    lineWidth: number;
  };
}
