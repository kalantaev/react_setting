let x = 100;
let y = 10;
let width = 6000;
let height = 2400;
let scale = 6;
let karkasDepth1 = 10;
const y3dcefficient = 0.9;
let cos7 = Math.cos(7.1 * Math.PI / 180);
let cos41 = Math.cos((90 - 41.25) * Math.PI / 180);
let sin7 = Math.sin(7.1 * Math.PI / 180);
let sin41 = Math.sin((90 - 41.25) * Math.PI / 180);
let canvas;

export const renderCanvasInTeg = tegId => {
    let canvas = document.getElementById('canvas-el');
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, window.innerWidth * 0.55, window.innerWidth * 0.20);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, window.innerWidth * 0.55, window.innerWidth * 0.20);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    return ctx;
};

export const renderCanvasToTex = tegId => {
    canvas = document.getElementById('canvas-tx');
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 9000, 2000);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, 9000, 2000);
    ctx.fillStyle = "rgba(0,0,255,0.13)";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    return ctx;
};

export const renderKarkas = (ctx) => {
    x = 100;
    y = 10;
    scale = 8;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, (width) / scale, height / scale);
    ctx.rect(x + karkasDepth1, y + karkasDepth1, ((width) / scale) - karkasDepth1 * 2, (height / scale) - karkasDepth1 * 2);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgb(0,0,255)";
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    //верхняя пунктирная
    ctx.moveTo(x - 35, y + karkasDepth1 / 2);
    ctx.lineTo(x + (width / scale) + 35, y + karkasDepth1 / 2);
    //нижняя пунктирная
    ctx.moveTo(x - 35, y + height / scale - karkasDepth1 + karkasDepth1 / 2);
    ctx.lineTo(x + (width / scale) + 35, y + height / scale - karkasDepth1 + karkasDepth1 / 2);
    //левая пунктирная
    ctx.moveTo(x + karkasDepth1 / 2, y - 35);
    ctx.lineTo(x + karkasDepth1 / 2, y + (height / scale) + 35);
    //правая пунктирная
    ctx.moveTo(x + width / scale - karkasDepth1 + karkasDepth1 / 2, y - 35);
    ctx.lineTo(x + width / scale - karkasDepth1 + karkasDepth1 / 2, y + (height / scale) + 35);
    // ctx.lineWidth = 0.9;
    ctx.setLineDash([45, 25]);
    ctx.strokeStyle = "rgba(255,120,0,0.8)";
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    return ctx;
};

export const renderWindow = (ctx, widthWindow) => {
    _renderWindow(ctx, widthWindow, x + width / scale / 1.8, y);
    _renderWindow(ctx, widthWindow, x + width / scale / 4, y + height / scale - karkasDepth1);
    drawVertikalWindow(ctx, x, y + height / scale / 6, widthWindow / scale, karkasDepth1);
    drawVertikalWindow(ctx, x + width / scale - karkasDepth1, y + height / scale / 3, widthWindow / scale, karkasDepth1)
}


const drawVertikalWindow = (ctx, x, y, length, width) => {
    //белый фон для скрытия стенки
    ctx.save();
    drawRect(ctx, x - 1, y, width + 2, length, 'white', 'white');
    drawRect(ctx, x, y, width, length, "rgba(0,0,0,0.41)");

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.moveTo(x, y + length);
    ctx.lineTo(x + width, y + length);
    ctx.strokeStyle = "rgb(0,0,255)";
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    return ctx;
}

const drawRect = (ctx, x, y, length, height, color, fillStyle) => {
    ctx.beginPath();
    ctx.rect(x, y, length, height);
    ctx.strokeStyle = color;
    ctx.stroke();
    if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    ctx.closePath();
}


const _renderWindow = (ctx, widthWindow, wX, wY) => {
    //белый фон для скрытия стенки
    ctx.save();
    ctx.beginPath();
    ctx.rect(wX, wY - 1, (widthWindow) / scale, karkasDepth1 + 2);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(wX, wY);
    ctx.lineTo(wX + (widthWindow) / scale, wY);
    ctx.moveTo(wX, wY + karkasDepth1);
    ctx.lineTo(wX + (widthWindow) / scale, wY + karkasDepth1);
    ctx.strokeStyle = "rgba(0,0,0,0.41)";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(wX, wY);
    ctx.lineTo(wX, wY + karkasDepth1);
    ctx.moveTo(wX + (widthWindow) / scale, wY);
    ctx.lineTo(wX + (widthWindow) / scale, wY + karkasDepth1);
    ctx.strokeStyle = "rgb(0,0,255)";
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

export const drawDimetry = (ctx, data) => {
    scale = 13;
    x = 350;
    y = -40;
    return draw3dRectangle(ctx, [{name: 'Karkas', width: data.w, height:data.h, x: x, y: y}].map(parseDataTo3DCreate)[0]);
};


export const drawFrontWindow = (ctx, wwidth, wheigth, windowImg) => {
    scale = 13;
    x = 350;
    y = -40;
    let parse = [{
        name: 'Window',
        width: wwidth,
        height: karkasDepth1,
        x: x + width / scale / 1.8,
        y: y
    }].map(parseDataTo3DCreate);
    let parse2 = [{
        name: 'Window',
        width: wwidth,
        height: karkasDepth1,
        x: x + width / scale / 4,
        y: y + height / scale - karkasDepth1
    }].map(parseDataTo3DCreate);
    let parse3 = [{
        name: 'Window',
        width: karkasDepth1,
        height: wwidth,
        x: x,
        y: y + height / scale / 6
    }].map(parseDataTo3DCreate);
    let parse4 = [{
        name: 'Window',
        width: wwidth,
        height: karkasDepth1,
        x: x + width / scale / 4,
        y: y + height / scale - karkasDepth1
    }].map(parseDataTo3DCreate);


    parse[0].h1 = parse[0].h2 - wheigth / scale;
    parse2[0].h1 = parse2[0].h2 - wheigth / scale;
    parse3[0].h1 = parse3[0].h2 - wheigth / scale;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.moveTo(parse[0].x4 * cos7 + sin41 * parse[0].y4, parse[0].y4 * cos41 - sin7 * parse[0].x4 - parse[0].h1);
    ctx.lineTo(parse[0].x4 * cos7 + sin41 * parse[0].y4, parse[0].y4 * cos41 - sin7 * parse[0].x4 - parse[0].h2);
    ctx.lineTo(parse[0].x3 * cos7 + sin41 * parse[0].y3, parse[0].y3 * cos41 - sin7 * parse[0].x3 - parse[0].h2);
    ctx.lineTo(parse[0].x3 * cos7 + sin41 * parse[0].y3, parse[0].y3 * cos41 - sin7 * parse[0].x3 - parse[0].h1);
    ctx.lineTo(parse[0].x4 * cos7 + sin41 * parse[0].y4, parse[0].y4 * cos41 - sin7 * parse[0].x4 - parse[0].h1);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.moveTo(parse2[0].x4 * cos7 + sin41 * parse2[0].y4, parse2[0].y4 * cos41 - sin7 * parse2[0].x4 - parse2[0].h1);
    ctx.lineTo(parse2[0].x4 * cos7 + sin41 * parse2[0].y4, parse2[0].y4 * cos41 - sin7 * parse2[0].x4 - parse2[0].h2);
    ctx.lineTo(parse2[0].x3 * cos7 + sin41 * parse2[0].y3, parse2[0].y3 * cos41 - sin7 * parse2[0].x3 - parse2[0].h2);
    ctx.lineTo(parse2[0].x3 * cos7 + sin41 * parse2[0].y3, parse2[0].y3 * cos41 - sin7 * parse2[0].x3 - parse2[0].h1);
    ctx.lineTo(parse2[0].x4 * cos7 + sin41 * parse2[0].y4, parse2[0].y4 * cos41 - sin7 * parse2[0].x4 - parse2[0].h1);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.setTransform(1, -0.12, 0, 1, 0, 50);
    ctx.drawImage(windowImg, parse[0].x4 * cos7 + sin41 * parse[0].y4, parse[0].y4 * cos41 - sin7 * parse[0].x4 - parse[0].h2, wwidth / scale, wheigth / scale);
    ctx.drawImage(windowImg, parse2[0].x4 * cos7 + sin41 * parse2[0].y4, parse2[0].y4 * cos41 - sin7 * parse2[0].x4 - parse2[0].h2, wwidth / scale, wheigth / scale);
    ctx.closePath();
    ctx.restore();

    drawLeftWindow(ctx, windowImg, parse3, wheigth)
}


export const drawKarkas3D = (ctx, data) => {

    scale = 13;
    x = 350;
    y = -40;

    let karkasData = [{name: 'Karkas', width: data.w, height:data.h, x: x, y: y}].map(parseDataTo3DCreate)[0];
    if (!data.inner) {
        drawKarkas3DBack(ctx, data.img, karkasData);
        drawKarkas3DRight(ctx, data.img, karkasData);
        // drawKarkas3DInner(ctx, data.img, karkasData);
        drawKarkas3DLeft(ctx, data.img, karkasData);
        drawKarkas3DFront(ctx, data.img, karkasData);
    } else {
        drawKarkas3DInner(ctx, data.img, karkasData);
    }
    return ctx;
}

export const drawTextyre3D = (ctx, windowImg, updateTexture, needCreate, width = 20) => {
    let w = Number.parseInt(width)
    for (var i = 0; i < 3000; i += w) {
        ctx.drawImage(windowImg, i, 0, w, 500);
    }

    if (updateTexture && needCreate) {
        try {
            canvas.toBlob(
                (b) => updateTexture(b), 'image/png')
        } catch (e) {
            console.info(e)
        }
    }
}


function drawLeftWindow(ctx, windowImg, {name, x1, x2, x3, x4, y1, y2, y3, y4, h1, h2, h, w, color, gorizontal}, wheigth) {

    ctx.save();
    ctx.beginPath();

    let x = x1 * cos7 + sin41 * y1;
    ctx.setTransform(1, 0.9, 0, 1, 0, -x * 0.61 * cos7 / sin41 - (x4 * 0.08) - (y4 * 0.062));
    ctx.drawImage(windowImg, x, y1 * cos41 - sin7 * x1 - h2, h * y3dcefficient * 0.77 / scale, wheigth / scale);

    ctx.closePath();
    ctx.restore();
}


function parseDataTo3DCreate(shape) {
    return {
        name: shape.name,
        x1: shape.x - 450,
        y1: shape.y + 400,
        x2: shape.x - 450 + shape.width / scale,
        y2: shape.y + 400,
        x3: shape.x - 450 + shape.width / scale,
        y3: shape.y + 400 + shape.height * y3dcefficient / scale,
        x4: shape.x - 450,
        y4: shape.y + 400 + shape.height * y3dcefficient / scale,
        w: shape.width,
        h: shape.height,
        h1: (shape.name == "Window" ? 1000 : 0) / scale,
        h2: (shape.name == "Window" ? 2100 : shape.name == 'Door' || shape.name == 'InnerDoor' ? 2000 : 2500) / scale,
        color: (shape.name == "Window") ?
            'rgb(0,12,255)' :
            (shape.name == 'Door' || shape.name == 'InnerDoor') ?
                'rgb(178,88,0)' :
                (shape.name == 'Partition') ?
                    'rgb(205,128,0)' : 'rgba(0, 0, 0, 0)',
        gorizontal: (shape.width > shape.height)

    }
}

const imageTextureHeight = 500;
const imageCoeffWidth = 2250 / 9000;
const imageCoeffHeight = imageTextureHeight / 2500;
const karkasHeight = 2500;

function drawKarkas3DInner(ctx, img, {name, x1, x2, x3, x4, y1, y2, y3, y4, h1, h2, color, w, h}) {
    ctx.save();
    ctx.beginPath();

    ctx.setTransform(1, -0.126, 1.17, 1, 0, 49);

    let xCoeff = 229;
    let yCoeff = 55;
    let coeffY =4 *(w - 1000)/8000;

    ctx.drawImage(img, 0, 0, imageCoeffWidth * w, 500,
        x1 * cos7 + sin41 * y1 - xCoeff,
        y1 * cos41 - sin7 * x1 - h1 - yCoeff,
        w / scale - coeffY, h * 0.59 / scale);

    ctx.closePath();
    ctx.restore();
}

function drawKarkas3DFront(ctx, img, {name, x1, x2, x3, x4, y1, y2, y3, y4, h1, h2, color, w, h}) {
    ctx.save();
    ctx.beginPath();

    ctx.setTransform(1, -0.1217, 0, 1, 0, 49);
    let coeffY = 29.6 - 0.0065 * h;
    ctx.drawImage(img, 0, 0, imageCoeffWidth * w, imageTextureHeight,
        x4 * cos7 + sin41 * y4,
        y4 * cos41 - sin7 * x4 - h2 - coeffY ,
        w / scale - 4, karkasHeight / scale);

    ctx.closePath();
    ctx.restore();
}

function drawKarkas3DLeft(ctx, img, {name, x1, x2, x3, x4, y1, y2, y3, y4, h1, h2, color, w, h}) {
    ctx.save();
    ctx.beginPath();
    ctx.setTransform(1, 0.875, 0, 1, 0, 49);
    let coeffY =(9 *h - 2700)/4700;
    ctx.drawImage(img, 0, 0, imageCoeffWidth * h, imageTextureHeight,
        x1 * cos7 + sin41 * y1,
        y1 * cos41 - sin7 * x1 - h2 - 200,
        h * 0.7 / scale - coeffY, karkasHeight / scale);
    ctx.closePath();
    ctx.restore();
}

function drawKarkas3DRight(ctx, img, {name, x1, x2, x3, x4, y1, y2, y3, y4, h1, h2, color, w, h}) {
    ctx.save();
    ctx.beginPath();
    ctx.setTransform(1, 0.875, 0, 1, 0, 49);
    let coeffY =(9 *h - 2700)/4700;
    let coeffx =400 + 400*(w - 3000)/6000;
    ctx.drawImage(img, 0, 0, imageCoeffWidth * h, imageTextureHeight,
        x2 * cos7 + sin41 * y2 ,
        y2 * cos41 - sin7 * x2 - h2 - coeffx,
        h * 0.7 / scale - coeffY, karkasHeight / scale);
    ctx.closePath();
    ctx.restore();
}

function drawKarkas3DBack(ctx, img, {name, x1, x2, x3, x4, y1, y2, y3, y4, h1, w, h, h2, color}) {
    ctx.save();
    ctx.beginPath();

    ctx.setTransform(1, -0.1217, 0, 1, 0, 49);
    ctx.drawImage(img, 0, 0, imageCoeffWidth * w, imageTextureHeight,
        x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h2 - 28,
        w / scale - 4, karkasHeight / scale);
    ctx.closePath();
    ctx.restore();
}

function draw3dRectangle(ctx, {name, x1, x2, x3, x4, y1, y2, y3, y4, w, h, h1, h2, color, gorizontal}) {

    //правая плоскость
    if (name !== 'InnerDoor') {
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([45, 25]);
        ctx.strokeStyle = 'rgba(0,0,0,0.31)';
        ctx.fillStyle = color;
        ctx.moveTo(x2 * cos7 + sin41 * y2, y2 * cos41 - sin7 * x2 - h1);
        ctx.lineTo(x2 * cos7 + sin41 * y2, y2 * cos41 - sin7 * x2 - h2);
        ctx.lineTo(x3 * cos7 + sin41 * y3, y3 * cos41 - sin7 * x3 - h2);
        ctx.lineTo(x3 * cos7 + sin41 * y3, y3 * cos41 - sin7 * x3 - h1);
        ctx.lineTo(x2 * cos7 + sin41 * y2, y2 * cos41 - sin7 * x2 - h1);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    //задняя плоскость
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([45, 30]);
    ctx.strokeStyle = 'rgba(0,0,0,0.31)';
    ctx.fillStyle = color;
    ctx.moveTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
    ctx.lineTo(x2 * cos7 + sin41 * y2, y2 * cos41 - sin7 * x2 - h1);
    ctx.lineTo(x2 * cos7 + sin41 * y2, y2 * cos41 - sin7 * x2 - h2);
    ctx.lineTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h2);
    ctx.lineTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    // нижняя плоскость
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([45, 25]);
    ctx.strokeStyle = 'rgba(0,0,0,0.31)';
    ctx.fillStyle = color;
    ctx.moveTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
    ctx.lineTo(x2 * cos7 + sin41 * y2, y2 * cos41 - sin7 * x2 - h1);
    ctx.lineTo(x3 * cos7 + sin41 * y3, y3 * cos41 - sin7 * x3 - h1);
    ctx.lineTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h1);
    ctx.lineTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    //передняя плоскость
    if (name !== 'InnerDoor' || gorizontal) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.fillStyle = color;
        ctx.moveTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h1);
        ctx.lineTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h2);
        ctx.lineTo(x3 * cos7 + sin41 * y3, y3 * cos41 - sin7 * x3 - h2);
        ctx.lineTo(x3 * cos7 + sin41 * y3, y3 * cos41 - sin7 * x3 - h1);
        ctx.lineTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h1);
        {
            ctx.fill();
            ctx.stroke();
        }
        ctx.closePath();
        ctx.restore();
    }
    if (name !== 'InnerDoor' || !gorizontal) {
        //левая плоскость
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.fillStyle = color;

        ctx.moveTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
        ctx.lineTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h2);
        ctx.lineTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h2);
        ctx.lineTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h1);
        ctx.lineTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
        if (name === 'Partition') {
            if (h > w) {
                ctx.stroke();
            } else {
                ctx.fill();
                ctx.stroke();
            }
        } else if (name === 'InnerDoor') {
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.stroke();
        }
        ctx.closePath();
        ctx.restore();
    }
    if (name !== 'InnerDoor') {
        //верхняя плоскость
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.fillStyle = color;
        ctx.moveTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h2);
        ctx.lineTo(x2 * cos7 + sin41 * y2, y2 * cos41 - sin7 * x2 - h2);
        ctx.lineTo(x3 * cos7 + sin41 * y3, y3 * cos41 - sin7 * x3 - h2);
        ctx.lineTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h2);
        ctx.lineTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h2);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    return ctx;

}