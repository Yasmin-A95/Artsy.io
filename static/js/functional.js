function makeMessage(x, y) {
    while ($("#tool-select").val() !== "erase") {
        let message = {
            tool: $("#tool-select").val(),
            x: x,
            y: y,
            width: $("#width").val(),
            color: $("#color").val(),
        }
        return message;
    } 
    let message = {
        tool: $("#tool-select").val(),
        x: x,
        y: y,
        width: $("#width").val(),
        color: "#ffffff",
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
    drawLine(message, ctx)
    } else if (message.tool === "spray") {
        sprayPaint(message, ctx)
    } else if (message.tool === "erase") {
        erase(message, ctx)
    } else if (message.tool === "text") {
        text(message, cxt)
    }
};

function drawLine(message, ctx) {
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = message.width;
    ctx.strokeStyle = message.color;
    ctx.moveTo(message.lastX, message.lastY);
    ctx.lineTo(message.x, message.y);
    ctx.stroke();
};

function sprayPaint (message, ctx) {
    // have it be like line except instead of a block space its a radius where pixels are selected at random within said radius
    // make a radius based on width
    // dots
    let radius = (message.width/2);
    ctx.fillStyle = message.color;
    for (let i = 0; i < 30; i++) {
        let offset = randomPointInRadius(radius);
        ctx.fillRect(message.x + offset.x, message.y + offset.y, 1, 1);
    }
};

function randomPointInRadius(radius) {
    while (true) { // what the fuck is this
        let x = Math.random() * 2 - 1;
        let y = Math.random() * 2 - 1;
        if (x * x + y * y <= 1)
            return {x: x * radius, y: y * radius};
    }
}

function erase(message, ctx) {
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = message.width;
    ctx.strokeStyle = message.color;
    ctx.moveTo(message.lastX, message.lastY);
    ctx.lineTo(message.x, message.y);
    ctx.stroke();
}

// function text(message, ctx) {
//     let text = prompt("Text:", "");
//     if (text) {
//         let ctx.beginPath(message.x)
//         console.log(pos)
//     }
// }