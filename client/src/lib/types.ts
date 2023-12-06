export interface IWSMsg {
  id: string;
  username: string;
  method: 'connection' | 'draw';
  figure: {
    type: 'brush' | 'rect' | 'finish';
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  };
}
