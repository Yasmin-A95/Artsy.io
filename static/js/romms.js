const ws = new WebSocket("ws://localhost:3000");

ws.onopen = function (event) {}

ws.onmessage = function (event) {
    console.log(event.data);
    document.getElementById("last-msg").innerText = JSON.parse(event.data)["params"]["room"];
}

function create() { ws.send('{ "type": "create" }'); }  //ws.send communicates with the server(rooms.js)

function join() {
    const code = document.getElementById("room-code").value;
    const obj = { "type": "join" , "params": { "code": code }}
    ws.send(JSON.stringify(obj));
}

function leave() { ws.send('{ "type": "leave" }'); }