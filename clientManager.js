const dgram = require('dgram');


//@ts-check

class ClientManager{

  constructor(server){
    /** @type {Array<{address:string, port:string, time:Date, id:string}>} */
    this.clients=[];
    /** @type {dgram.Socket} */
    this.server = server;
    setInterval(this.checkHeartbeat.bind(this), 1000);
  }

  /**
   * add new client or store heartbeat
   * send back uid to client
   * @param {string} address
   * @param {string} port
   */
  pushClient(address, port){
    
    const idx = this.clients.findIndex(client=>client.address === address && client.port === port)    
    if(idx != -1) {
      this.clients[idx].time = new Date();
      return;
    }
    const uid = this.generateRandomToken();
    this.clients.push({address:address, port:port, time:new Date(), id:uid});
    
    const msg = new Buffer.from(`UID:${uid}`)
    this.server.send(msg, 0, msg.length, port, address, ()=>{
      console.log(`uid was sent to user ${uid}`);
    });
  }

  /**
   * check and delete disconnected client
   */
  checkHeartbeat(){

    if(this.clients.length>0){
      console.log(this.clients);      
    }
    
    this.clients = this.clients.filter(client=>{
      const msg = new Buffer.from(`UID:${client.id}`)
      this.server.send(msg, 0, msg.length, port, address, ()=>{
        console.log(`uid was sent to user ${client.id}`);
      });

      const diff = new Date().getTime() - client.time.getTime();
      if(diff <= 1000) return true;
      console.log(`User ${client.id} was disconnected.`);
      return false;
    })
  }

  s4(){
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }

  generateRandomToken(){
    return `${this.s4()}-${this.s4()}`;
  }

  /**
   * send to specific client
   * @param {string} uid 
   * @param {string} value
   */
  sendControllerInfoTo(uid, value){
    const uidToLower = uid.toLowerCase();
    this.clients.forEach(client=>{
      if(client.id === uidToLower){
        const msg = new Buffer.from(`Controller:${value}`)
        this.server.send(msg, 0, msg.length, client.port, client.address, null);
      }
    })
  }

}

module.exports = ClientManager;