// const { reset } = require("nodemon");
// const wsImport = require("ws")

// const WebSocketServer = wsImport.WebSocketServer

// const wss = new WebSocketServer({ port: 3000 });

// const maxClients = 2;
// let rooms = {};

// wss.on('connection', function connection(ws) {
//   ws.on('message', function message(data) {
//     console.log("hello woeld")
//     const obj = JSON.parse(data);
//     const type = obj.type;
//     const params = obj.params;
// // the functionality of individual rooms
//     switch (type) {
//       case "create":
//         create(params);
//         break;

//       case "join":
//         join(params);
//         break;

//       case "leave":
//         leave(params);
//         break;  


//       default:
//           console.warn(`Type: ${type} unknown`);
//         break;
//     }
//   });


// function generalInformation(ws) {
//   let obj;
//   if (ws["room"] !== undefined)
//   obj = {
//     "type": "info",
//     "params": {
//       "room": ws["room"],
//       "no-clients": rooms[ws["room"]].length,
//     }
//   }
//   else
//   obj = {
//     "type": "info",
//     "params": {
//       "room": "no room",
//     }
//   }

//   ws.send(JSON.stringify(obj));
// }

// function create(params) {
//   console.log('function called.')
//   const room = genKey(5);
//   console.log(room);
//   rooms[room] = [ws];
//   ws["room"] = room;

//   generalInformation(ws);
// }

// function genKey(length) {
//   let result = '';
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   for (let i = 0; i < length; i++) {
//       result += characters.charAt(
//         Math.floor(Math.random() * characters.length));
//   }
//   return result;
// }


// function join(params) {
//   const room = params.code;
//   console.log('trying to join', room);
//   if (!Object.keys(rooms).includes(room)) {
//     console.warn(`Room ${room} does not exist!`);
//     return;
//   }

//   if (rooms[room].length >= maxClients) {
//     console.warn(`Room ${room} is full!`);
//     return;
//   }

//   //write function that loads the canvas once player joins also ??? CSS

//   rooms[room].push(ws);
//   ws["room"] = room;

// 	generalInformation(ws);
// }

// function leave(params) {
//   const room = ws.room;
// 	rooms[room] = rooms[room].filter(so => so !== ws);
//   ws["room"] = undefined;

//   if (rooms[room].length == 0)
//     close(room);
// }

// function close(room) {
//   rooms = rooms.filter(key => key !== room);
// }

  
  
  
  
// });



// // rooms[room].forEach(cl => cl.send(...));