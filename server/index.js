const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

app.ws('/', (ws, req) => {
  console.log('Connected successfully');
  ws.send(JSON.stringify('You are connected'));
  ws.on('message', (JSONmsg) => {
    const msg = JSON.parse(JSONmsg);

    switch (msg.method) {
      case 'connection':
        connectionHandler(ws, msg);
        break;
      case 'draw':
        broadcastConnection(ws, msg);
        break;
      default:
        break;
    }
  });
});

app.post('/image', (req, res) => {
  try {
    const data = req.body.img.replace('data:image/png;base64,', '');
    fs.writeFileSync(
      path.resolve(__dirname, 'files', `${req.query.id}.jpg`),
      data,
      'base64'
    );
    return res.status(200).json('Image loaded');
  } catch (error) {
    console.log(error);
    res.status(500).json('Unknown error');
  }
});
app.get('/image', (req, res) => {
  try {
    const file = fs.readFileSync(
      path.resolve(__dirname, 'files', `${req.query.id}.jpg`)
    );
    const data = `data:image/png;base64,` + file.toString('base64');
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unknown error');
  }
});

app.listen(PORT, () => console.log(`server started on PORT: ${PORT}`));

const connectionHandler = (ws, msg) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach((client) => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg));
    }
  });
};
