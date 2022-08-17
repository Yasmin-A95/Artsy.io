$( document ).ready(function() {
    
let SERVER_URL = location.origin.replace(/^http/, 'ws');
let connection = new WebSocket(SERVER_URL);
// initialise the important big things
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDrawing = false;

function handleMouseDown(e) {
isDrawing = true;
};

function handleMouseUp(e) {
    isDrawing = false;
};

function handleMouseMove(e) {
    if (isDrawing){
    sendMessage(makeMessage(e.offsetX, e.offsetY), connection);
    }
};
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mousemove", handleMouseMove)

connection.onmessage = e => {
    receiveMessages(e, ctx);
};
});

