import { useEffect, useRef, useState } from 'react';
import '../styles/canvas.css';
import { observer } from 'mobx-react-lite';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import { useParams } from 'react-router-dom';
import { IWSMsg } from '../lib/types';
import Rect from '../tools/Rect';
import axios from 'axios';

const Canvas = observer(() => {
  const [isShowModal, setIsShowModal] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    axios.get(`http://localhost:8000/image?id=${params.id}`).then((res) => {
      const img = new Image();
      img.src = res.data;
      const ctx = canvasRef.current?.getContext('2d');
      img.onload = () => {
        if (!canvasRef.current) return;

        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx?.drawImage(
          img,
          0,
          0,
          canvasRef.current?.width,
          canvasRef.current?.height
        );
      };
    });
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket('ws://localhost:8000/');
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));

      socket.onopen = () => {
        console.log('WS opened');

        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: 'connection',
          })
        );
      };

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.method) {
          case 'connection':
            console.log(`${msg.username} connected to ws`);
            break;
          case 'draw':
            drawHandler(msg);
            break;

          default:
            break;
        }
      };
    }
  }, [canvasState.username]);

  const drawHandler = (msg: IWSMsg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current?.getContext('2d');

    switch (figure.type) {
      case 'brush':
        Brush.staticDraw(ctx, figure.x, figure.y);
        break;
      case 'rect':
        Rect.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          figure.color
        );
        break;
      case 'finish':
        ctx?.beginPath();
        break;

      default:
        break;
    }
  };

  const mouseUpHandler = () => {
    if (!canvasRef.current) return;
    canvasState.pushToUndo(canvasRef.current.toDataURL());

    axios
      .post(`http://localhost:8000/image?id=${params.id}`, {
        img: canvasRef.current.toDataURL(),
      })
      .then((res) => console.log(res));
  };

  const connectionHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    canvasState.setUsername(usernameRef.current?.value || '');
    setIsShowModal(false);
  };

  return (
    <div className="canvas">
      <canvas
        onMouseDown={mouseUpHandler}
        ref={canvasRef}
        width={600}
        height={400}
      />
      {isShowModal && <div className="backdrop"></div>}
      <dialog open={isShowModal} className="modal">
        <form onSubmit={connectionHandler}>
          <label>
            Enter your name:
            <input
              required
              type="text"
              ref={usernameRef}
              placeholder="username"
            />
          </label>
          <button>Enter</button>
        </form>
      </dialog>
    </div>
  );
});

export default Canvas;
