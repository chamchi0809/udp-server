const dgram = require('dgram');
const ClientManager = require('./clientManager');


const server = dgram.createSocket('udp4');
const clientManager = new ClientManager(server);

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, senderInfo) => {
  const params = msg.toString().split(' ');
  if(msg == 'Heartbeat'){
    clientManager.pushClient(senderInfo.address, senderInfo.port);
    return;
  }
  switch(params[0]){
    case 'Controller':
      clientManager.sendControllerInfoTo(params[1], params.slice(2).join(' '));
      break;
  }

});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening on ${address.address}:${address.port}`);
});

server.bind(5500, '127.0.0.1');