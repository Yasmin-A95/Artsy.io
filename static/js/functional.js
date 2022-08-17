function makeMessage(x, y) {
    let message = {
        tool: "line",
        x: x,
        y: y,
        width: $("#width").val(),
        color: $("#color").val(),
    }
    return message;
};

function receiveMessages(messageEvent, ctx) {
    let message = JSON.parse(messageEvent.data);
    draw(message, ctx);
};


function sendMessage(message, connection) {
    connection.send(JSON.stringify(message));
};


function draw (message, ctx) {
    if (message.tool === "line") {
    drawLine(message, ctx);
    };
}

function drawLine(message, ctx) {
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = message.width;
    ctx.strokeStyle = message.color;
    ctx.moveTo(message.lastX, message.lastY);
    ctx.lineTo(message.x, message.y);
    ctx.stroke();
}

