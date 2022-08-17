// -- init websockets
let SERVER_URL = location.origin.replace(/^http/, 'ws');
let connection = new WebSocket(SERVER_URL);

// -- init canvas
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// -- set random color
let hue = Math.random() * 360; // 0-360
hue = Math.floor(hue);
let color = `hsl(${hue} 80% 50%)`;
document.querySelector("#color").value = color;

// {"x":256,"y":75,"lastX":256,"lastY":75,"width":"10","color":"hsl(146 80% 50%)"}

let lastX, lastY;

canvas.addEventListener("mousedown", e => {
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mousemove", e => {
  if (!e.buttons) return;

  let message = {
    x: e.offsetX, 
    y: e.offsetY,
    lastX: lastX,
    lastY: lastY,
    width: document.querySelector("#width").value,
    color: document.querySelector("#color").value
  };

  connection.send(JSON.stringify(message));
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

// -- on message from server
connection.onmessage = e => {
  console.log(document.querySelector("#color").value)
  let msg = JSON.parse(e.data);

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = msg.width;
  ctx.strokeStyle = msg.color;

  ctx.moveTo(msg.lastX, msg.lastY);
  ctx.lineTo(msg.x, msg.y);
  ctx.stroke();
};

// -- change cursor
canvas.style.cursor = "none";
let el = document.createElement("div");
el.setAttribute("id", "cursor");
document.body.append(el);

canvas.addEventListener("mousemove", e => {
  let width = document.querySelector("#width").value;

  document.querySelector("#cursor").style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(${e.x - width / 2}px) translateY(${e.y -
    width / 2}px);
    background-color: ${document.querySelector("#color").value};
    width: ${width}px;
    height: ${width}px;
    border-radius: 5000px;
    opacity: 0.5;
    pointer-events: none;
    border: 1px solid rgba(0 0 0 / 0.6);
    display: block;
  `;
});
canvas.addEventListener("mouseout", e => {
  document.querySelector("#cursor").style.display = "none";
});
