let bubble = new Image();
bubble.onload = () => {
    console.log('Bubble loaded!');
};
bubble.src = '../assets/bubble.png';

let boxOutline = new Image();
boxOutline.onload = () => {
    console.log('Box outline loaded!');
}
boxOutline.src = '../assets/box_outline.png';

let boxFill = new Image();
boxFill.onload = () => {
    console.log('Box fill loaded!');
};
boxFill.src = '../assets/box_fill.png';

function drawBox(context, x, y) {
    const boxScaleWidth = boxOutline.width / 2;
    const boxScaleHeight = boxOutline.height / 2;
    const fillScaleWidth = boxFill.width / 2;
    const fillScaleHeight = boxFill.height / 2;
    
    // context.beginPath();
    // context.moveTo(x, y - boxScaleHeight / 2);
    // context.lineTo(x + 50, y - boxScaleHeight / 2);
    // context.stroke();
    // console.log(y-boxScaleHeight/2);
    
    // Draw the box
    context.save();
    context.translate(x, y);
    context.globalAlpha = 0.2;
    context.drawImage(boxFill, -fillScaleWidth / 2, -fillScaleHeight / 2, fillScaleWidth, fillScaleHeight);
    context.globalAlpha = 1.0;
    context.drawImage(boxOutline, -boxScaleWidth / 2, -boxScaleHeight / 2, boxScaleWidth, boxScaleHeight);
    context.restore();
}

function drawWinOrLoseScreen(context, canvas, suikas) {
    console.log(suikas);
    context.fillStyle='rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#FFFFFF';
    context.font = '48px Arial';
    context.textAlign = 'center';
    if (suikas[suikas.length-1].level === 11) {
        context.fillText('SUIKA!!!', canvas.width / 2, canvas.height / 2);
    } else {
        context.fillText('SUIKA OUT~ T-T', canvas.width / 2, canvas.height / 2);
    }

    context.fillStyle = '#A9A9A9';
    context.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 50);
    context.fillStyle = '#696969';
    context.font = '18px Arial';
    context.fillText('Restart', canvas.width / 2, canvas.height / 2 + 80);
}

function drawSuika(suikas, currentSuika) {
    for (let i = 0; i < suikas.length; i++) {
        suikas[i].draw();
    }
    currentSuika.draw();
}

function drawForecast(context, suikaBag, canvas) {
    let suikaAspectRatio = suikaBag[1].img.width / suikaBag[1].img.height;
    let drawSuikaWidth = 80;
    let drawSuikaHeight = drawSuikaWidth / suikaAspectRatio;

    let bubbleAspectRatio = bubble.width / bubble.height;
    let drawBubbleWidth = 200;
    let drawBubbleHeight = drawBubbleWidth / bubbleAspectRatio;

    context.drawImage(
        suikaBag[1].img, 
        canvas.width * 5/6 - drawSuikaWidth / 2, 
        canvas.height / 5 - drawSuikaHeight / 2, 
        drawSuikaWidth, drawSuikaHeight
    );
    context.drawImage(
        bubble, 
        canvas.width * 5/6 - drawBubbleWidth / 2, 
        canvas.height / 5 - drawBubbleHeight / 2, 
        drawBubbleWidth, drawBubbleHeight
    );
    context.fillStyle = '#FFFFFF';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText('Next', canvas.width * 5/6, canvas.height / 5 - drawBubbleHeight / 4);
}

function draw(paimon, suikas, suikaBag, currentSuika, context, canvas) {
    paimon.draw(canvas);
    drawSuika(suikas, currentSuika);
    drawBox(context, canvas.width / 2, 425);
    drawForecast(context, suikaBag, canvas);
}

export { drawBox, drawWinOrLoseScreen, drawSuika, draw };