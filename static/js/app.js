    let SERVER_URL = location.origin.replace(/^http/, 'ws');
let connection = new WebSocket(SERVER_URL);
// initialise the important big things
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// resize, 
// save a copy of the full canvas to the server 
// then when someone connects it sends that copy of the canvas and initializes with their copy of the canvas 
// maybe every two hours it refreshes or something
// every 500 milleseconds it is saved and then new people get that one
// the server every 500 milleseconds pics one connection at random (or maybe always connection 1 or something idfk how connections are counted,)

// for mobile we need touch down

// int isDrawing

let isDrawing = false;

// handle mouse events
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
// touch events for mobile

function handleTouchStart(e) {
    isDrawing = true;
};

function handleTouchEnd(e) {
    isDrawing = false;
};

function handleTouchMove(e) {
    if (isDrawing){
        sendMessage(makeMessage(e.offsetX, e.offsetY))
    };
};

// attatch event handlers
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mousemove", handleMouseMove);


// this and the above don't play well together. Interesting. - Debug later

// canvas.addEventListener("touchstart", handleTouchDown);
// canvas.addEventListener("touchend", handleTouchEnd);
// canvas.addEventListener("touchmove", handleTouchMove);

connection.onmessage = e => {
    receiveMessages(e, ctx);
    
};

