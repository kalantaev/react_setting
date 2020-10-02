//----/ start constants /----//
const constructorTitle = 'Конструктор бытовок';


const baseColor = "rgb(0,0,255)";
const colorBlack = "rgba(0, 0, 0)";
const colorWhite = "rgb(249,249,249)";
const colorGrey = "rgba(0,0,0,0.41)";
const colorRed = "red";
const defPartitionWidth = 190;

const doorWidth = 800;
const windowWidth = 1100;
const defScaleValue = 8.4;
const karkasDepth = 70 / defScaleValue;
const defPartitionHeight = 50;
const y3dcefficient = 0.9;
let rootDivId;
let cos7 = Math.cos(7.1 * Math.PI / 180);
let cos41 = Math.cos((90 - 41.25) * Math.PI / 180);
let sin7 = Math.sin(7.1 * Math.PI / 180);
let sin41 = Math.sin((90 - 41.25) * Math.PI / 180);
let lowScreen = true;
//----/ end constants /----//

//----/ start properties /----//
var scale = defScaleValue;
var karkas;
var wheel_handle = null;
var cw = 2000;
var ch = 1000;
let id = 1;
let allDraging = false;
let accuracy = 4;
let shapesMap = new Map();
let view3D = false;
//----/ end properties /----//
const price = {
    karkas6x24: 100000,
    karkas6x48: 200000,
    partition1m: 2.3,
    light: 500,
    door: 3000
};

//----/ start enums /----//
const POSITION = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};
const DIRECTION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

const OPENING_TYPE = {
    IN: 'IN',
    OUT: 'OUT'
};
const HTML_ELEMENT = {
    BUTTON: 'button',
    TABLE: 'table',
    THEAD: 'thead',
    TBODY: 'tbody',
    TH: 'th',
    TR: 'tr',
    TD: 'td',
    DIV: 'div',
    SPAN: 'span',
    H1: 'h1',
    H4: 'h4',
    IMG: 'img',
}
const SELECT_TEMPLATE_ID = 'templates_select';

var canvas;
var ctx;
var shapes = [];

//----/ end enums /----//

//**-- textures ---**//

var pol = new Image();
pol.src = "./img/texture/pol.png";


var pencil = new Image();
pencil.src = "./img/texture/pencil.jpg";


var fon = new Image();
fon.src = "./img/texture/karkas.png";

var karkas_left = new Image();
karkas_left.src = "./img/texture/karkas-left.png";

var vagonka = new Image();
vagonka.src = "./img/texture/vagonka.PNG";

var karkas_right = new Image();
karkas_right.src = "./img/texture/karkas-right.PNG";

var karkas_right1 = new Image();
karkas_right1.src = "./img/texture/karkas-right1.PNG";


var windowImg = new Image();
windowImg.src = "./img/texture/window.PNG";


Number.prototype.degree = function () {
    return this * Math.PI / 180;
};

//---------------------- styles --------------------------//
const blokForSelect = 'display: inline-block;\n' +
    'margin: 0 15px 35px 0;\n' +
    'vertical-align: top;\n' +
    'width: 23%;\n' +
    'border-radius: 20px;\n' +
    'box-shadow: 0 5px 5px 3px\n' +
    '#cecece;\n' +
    'text-align: center;\n' +
    'padding-bottom: 20px;';
const blokForSelect2 = 'display: inline-block;\n' +
    'margin: 0 15px 35px 0;\n' +
    'vertical-align: top;\n' +
    'width: 23%;\n' +
    'border-radius: 20px;\n' +
    'box-shadow: 0 5px 5px 3px\n' +
    'red;\n' +
    'text-align: center;\n' +
    'padding-bottom: 20px;';
const TEXT_ALIGN_CENTER = 'text-align: center;';
const CURSOR_POINTER = 'cursor: pointer;';
//---------------------- отрисовка html ------------------//


_addControlBtn = (div) => {
    let buttonsId = "canvas_buttons";

    let buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("id", buttonsId);
    div.insertBefore(buttonDiv, div.children[2]);

    buttonDiv.appendChild(createHtmlElement(HTML_ELEMENT.BUTTON, {
        style: 'margin-right: 5px',
        text: 'Добавить перегородку',
        onClick: addElement
    }));
    buttonDiv.appendChild(createHtmlElement(HTML_ELEMENT.BUTTON, {
        style: 'margin-right: 5px',
        text: 'Добавить входную дверь',
        onClick: () => selectDoor(div)
    }));
    buttonDiv.appendChild(createHtmlElement(HTML_ELEMENT.BUTTON, {
        style: 'margin-right: 5px',
        text: 'Добавить окно',
        onClick: () => selectWindow(div)
    }));
    buttonDiv.appendChild(createHtmlElement(HTML_ELEMENT.BUTTON, {
        style: 'margin-right: 5px',
        text: 'Добавить свечку',
        onClick: addLight
    }));

    //3D view
    let view3d = createHtmlElement(HTML_ELEMENT.BUTTON, {text: 'Предпросмотр'});
    view3d.addEventListener("click", function () {
        view3D = !view3D;
        changePositionAndScale();
        drawAll();
    });
    buttonDiv.appendChild(view3d);

    let dawnload = createHtmlElement(HTML_ELEMENT.BUTTON, {text: 'Скачать'});
    dawnload.addEventListener("click", function () {
        canvas.toBlob((b) => saveByteArray(b), 'image/png');
    });
    buttonDiv.appendChild(dawnload);
};

function saveByteArray(blob) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";


    url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'name';
    a.click();
    window.URL.revokeObjectURL(url);

};

function changePositionAndScale() {
    if (view3D) {
        if (karkas.height === 2400 && karkas.width === 6000) {
            karkas.setX(lowScreen ? 250 : 200);
            karkas.setY(lowScreen ? 10 : 300);
            let s = lowScreen ? 11.5 : 7;
            scale = s
        }
    } else {
        if (karkas.height === 2400 && karkas.width === 6000) {
            scale = lowScreen ? defScaleValue : 4.5;
            karkas.setX(lowScreen ? 100 : 200);
            karkas.setY(lowScreen ? 70 : 150);
        }
    }
    drawAll();
}

_renderCanvas = (div) => {

    _addControlBtn(div);

//создаем холст для рисования
    canvas = document.createElement("canvas");
//рисовать будем в двух плоскостях
    ctx = canvas.getContext("2d");
//устанавливаем размеры холсту
    canvas.width = window.innerWidth * 0.85;
    canvas.height = window.innerHeight * (lowScreen ? 0.45 : 0.825);
//добавляем холст на страницу
    div.appendChild(canvas);

    if (canvas.addEventListener) canvas.addEventListener("DOMMouseScroll", mouse_wheel, false);
    canvas.onmousewheel = document.onmousewheel = mouse_wheel;
    set_handle(canvas, handleMouseWheelUp);

    reOffset();

    window.onscroll = function (e) {
        e.preventDefault();
        e.stopPropagation();
        reOffset();
    };
    window.onresize = function (e) {
        reOffset();
    };
    canvas.onresize = function (e) {
        reOffset();
    };
// listen for mouse events
    canvas.onmousedown = handleMouseDown;
    canvas.onmousemove = handleMouseMove;
    canvas.onmouseup = handleMouseUp;
    canvas.onmouseout = handleMouseOut;
    canvas.onmouseWheelUp = handleMouseWheelUp;


    deserialize();
    if (shapes && shapes.length != 0) {
        let buttonsId = "canvas_buttons";
        removeElement(buttonsId);
        _addControlBtn(div);
    }
    drawAll();
    reOffset();
};

function createDivWindow(div, imgSrc, imgName, width, price) {
    let divWindow = createHtmlElement(HTML_ELEMENT.SPAN, {
        classV: 'selectable-block', onClick: () => {
            addWindow(width, price, imgName);
            serialize();
            removeElement('select-window-screen');
        }
    });
    if (imgSrc) {
        divWindow.appendChild(createHtmlElement(HTML_ELEMENT.IMG, {
            src: imgSrc,
            style: 'height: 150px;cursor: pointer'
        }));
    }
    divWindow.appendChild(createHtmlElement(HTML_ELEMENT.DIV, {html: imgName}));
    div.appendChild(divWindow);
}

function createDivDoor(div, imgSrc, imgName, width, price, name, doorId, base, parentId, inner) {
    let divWindow = createHtmlElement(HTML_ELEMENT.SPAN, {
        classV: 'selectable-block', onClick: () => {
            if (inner && parentId) {
                let parent = getShapeById(parentId);
                let door = new InnerDoor(parent, price, name);
                parent.doorId = door.getId();
            } else {
                if (doorId) {
                    let shapeById = getShapeById(doorId);
                    shapeById.price = shapeById.base && base ? undefined : price;
                    shapeById.printName = name;
                    shapeById.width = width;
                } else {
                    addDoor(width, price, name);
                }
            }
            serialize();
            removeElement('select-window-screen');
            drawAll();
        }
    });
    if (imgSrc) {
        divWindow.appendChild(createHtmlElement(HTML_ELEMENT.IMG, {
            src: imgSrc,
            style: 'height: 150px;cursor: pointer'
        }));
    }
    divWindow.appendChild(createHtmlElement(HTML_ELEMENT.DIV, {html: imgName}));
    div.appendChild(divWindow);
}


selectWindow = (root) => {
    let div = document.createElement("div");
    div.setAttribute("id", "select-window-screen");

    let div2 = document.createElement("div");
    div2.setAttribute("id", "full-screen-background");
    div2.setAttribute("style", 'position: fixed;width: 100%;height: 100%;background-color:#040404cc;top: 0%;left: 0%;z-index:499');

    let div3 = document.createElement("div");

    div3.setAttribute("style", 'position: fixed;width: 60%;height: 86%;background-color:white;top: 7%;left: 20%;z-index:501; padding: 25px;');
    div3.appendChild(createHtmlElement(HTML_ELEMENT.H4, {style: TEXT_ALIGN_CENTER, text: 'Выберете окно'}));
    windowsEl.forEach(item => {
        createDivWindow(div3, item.image, windowNameTmpl(item.width, item.height, item.price), item.width, item.price);
    });
    div.appendChild(div2);
    div.appendChild(div3);
    root.appendChild(div);
};


selectDoor = (root, doorId, inner, parentId) => {
    let div = document.createElement("div");
    div.setAttribute("id", "select-window-screen");

    let div2 = document.createElement("div");
    div2.setAttribute("id", "full-screen-background");
    div2.setAttribute("style", 'position: fixed;width: 100%;height: 100%;background-color:#040404cc;top: 0%;left: 0%;z-index:499');

    let div3 = document.createElement("div");

    div3.setAttribute("style", 'position: fixed;width: 60%;height: 86%;background-color:white;top: 7%;left: 20%;z-index:501; padding: 25px;');
    div3.appendChild(createHtmlElement(HTML_ELEMENT.H4, {style: TEXT_ALIGN_CENTER, text: 'Выберете дверь'}));
    doorsEl.filter(item => (inner && item.inner) || (!inner && item.outer)).forEach(item => {
        createDivDoor(div3, item.image, doorNameTmpl(item.name, item.price), item.width, item.price, item.name, doorId, item.base, parentId, inner);
    });
    div.appendChild(div2);
    div.appendChild(div3);
    root.appendChild(div);
};

let windowNameTmpl = (w, h, prise) => `<br/><b>Окно ${w} x ${h} мм <br/><span style="color: #0c7abf">${prise} руб.</span></b>`;
let doorNameTmpl = (name, prise) => `<br/><b>${name}<br/><span style="color: #0c7abf">${prise} руб.</span></b>`;

setFullScreen = () => {
    lowScreen = false;

    let root = document.getElementById(rootDivId);
    root.appendChild(createHtmlElement(HTML_ELEMENT.DIV, {
        id: "full-screen-background",
        style: 'position: fixed;width: 100%;height: 100%;background-color:#040404cc;top: 0%;left: 0%;z-index:499'
    }));
    let div = createHtmlElement(HTML_ELEMENT.DIV, {
        id: "full-screen",
        style: 'position: fixed;width: 86%;height: 86%;background-color:white;top: 7%;left: 8%;z-index:500'
    });
    let lowScreenBtn = createHtmlElement(HTML_ELEMENT.IMG, {
        src: 'img/low-screen.png',
        width: '30px',
        style: 'float: right; cursor: pointer'
    });
    lowScreenBtn.addEventListener("click", function () {
        serialize();
        setLowScreen();
        renderCalculator();
        create();
        deserialize();
    });
    div.appendChild(lowScreenBtn);
    root.appendChild(div);
    _renderCanvas(div);
    changePositionAndScale();

};

setLowScreen = () => {
    lowScreen = true;
    changePositionAndScale();
    removeElement("full-screen");
    removeElement("full-screen-background");
};

function removeElement(id) {
    var elem = document.getElementById(id);
    if (elem) {
        return elem && elem.parentNode.removeChild(elem);
    }
}

renderCalculator = (idElement) => {
    if (idElement) {
        rootDivId = idElement;
    }
    let div = createHtmlElement(HTML_ELEMENT.DIV, {id: "low-screen"});
    div.appendChild(createHtmlElement(HTML_ELEMENT.H1, {style: TEXT_ALIGN_CENTER, text: constructorTitle}));
    let divNew = createHtmlElement(HTML_ELEMENT.DIV, {id: 'select-karkas-to-create'});
    divNew.appendChild(createHtmlElement(HTML_ELEMENT.H4, {style: TEXT_ALIGN_CENTER, text: 'Выберете тип бытовки'}));
    getKarkasTypesToCreate().forEach(k => {
        divNew.appendChild(divCreateNew(k))
    });
    div.appendChild(divNew);
    if ((sessionStorage.getItem('shapes') !== 'undefined' && sessionStorage.getItem('shapes') !== null)) {
        let divContiny = createHtmlElement(HTML_ELEMENT.DIV, {id: 'contyny-create'});
        divContiny.appendChild(createHtmlElement(HTML_ELEMENT.H4, {
            style: TEXT_ALIGN_CENTER,
            text: 'Продолжите ранее начатый проект'
        }));
        divContiny.appendChild(divContyny());
        div.appendChild(divContiny);
    }
    let divTmp = createHtmlElement(HTML_ELEMENT.DIV, {id: 'create-from-tmplate'});
    divTmp.appendChild(createHtmlElement(HTML_ELEMENT.H4, {
        style: TEXT_ALIGN_CENTER,
        text: 'Выберете существующий тип и измените под свои нужды'
    }));
    getKarkasTemlateToCreate().forEach(k => {
        divTmp.appendChild(divCreateTmp(k))
    });
    div.appendChild(divTmp);
    document.getElementById(rootDivId).appendChild(div);
};


const stylesCss = '.selectable-block:hover{box-shadow: 0 5px 7px 4px #96def4;}' +
    '.selectable-block{display: inline-block;margin: 0 15px 35px 0;vertical-align: top;width: 23%;border-radius: 20px;box-shadow: 0 5px 5px 3px #cecece;text-align: center;padding-bottom: 20px;cursor: pointer}';
let css = document.createElement('style');
css.type = 'text/css';
if (css.styleSheet)
    css.styleSheet.cssText = stylesCss;
else
    css.appendChild(document.createTextNode(stylesCss));

document.getElementsByTagName("head")[0].appendChild(css);

function divCreateNew(item) {
    let div = createHtmlElement(HTML_ELEMENT.SPAN, {
        classV: 'selectable-block', onClick: () => {
            create();
            setKarkas(item.w, item.h, item.p);
        }
    });
    item.img && div.appendChild(createHtmlElement(HTML_ELEMENT.IMG, {src: item.img, width: '200px'}));
    div.appendChild(createHtmlElement(HTML_ELEMENT.H4, {text: item.t, style: TEXT_ALIGN_CENTER + 'padding-top:10px'}));
    div.appendChild(createHtmlElement(HTML_ELEMENT.DIV, {text: 'Цена: ' + item.p + 'руб.', style: TEXT_ALIGN_CENTER}));
    return div;
}

function divContyny() {
    let div = createHtmlElement(HTML_ELEMENT.SPAN, {
        classV: 'selectable-block', onClick: () => {
            create();
            deserialize();
        }
    });

    div.appendChild(createHtmlElement(HTML_ELEMENT.H4, {
        text: 'Продолжить',
        style: TEXT_ALIGN_CENTER + 'padding-top:10px'
    }));
    return div;
}

function divCreateTmp(item) {
    let div = createHtmlElement(HTML_ELEMENT.SPAN, {
        classV: 'selectable-block', onClick: () => {
            create();
            createFromTemplate(item.data);
        }
    });
    item.img && div.appendChild(createHtmlElement(HTML_ELEMENT.IMG, {
        src: item.img,
        width: '200px',
        style: 'padding-top:15px'
    }));
    div.appendChild(createHtmlElement(HTML_ELEMENT.H4, {
        text: item.name,
        style: TEXT_ALIGN_CENTER + 'padding-top:10px;padding-bottom: 0 !important;'
    }));
    item.p && div.appendChild(createHtmlElement(HTML_ELEMENT.DIV, {
        text: 'Цена: ' + item.p + 'руб.',
        style: TEXT_ALIGN_CENTER
    }));
    return div;
}

function create() {
    removeElement('select-karkas-to-create');
    removeElement('contyny-create');
    removeElement('create-from-tmplate');
    let fullScreenBtn = createHtmlElement(HTML_ELEMENT.IMG, {
        src: 'img/full-screen.png',
        width: '30px',
        style: 'float: right; cursor: pointer',
        onClick: setFullScreenClick
    });
    let screen = document.getElementById("low-screen");
    screen.insertBefore(fullScreenBtn, screen.children[0]);
    _renderCanvas(screen);
}

/**
 * Получение возможных для построения каркасов //todo получать с сервера
 */
function getKarkasTypesToCreate() {
    return [
        {w: 6000, h: 2400, t: '6000 х 2400 мм', p: 80000},
        {w: 5000, h: 2400, t: '5000 х 2400 мм', p: 70000},
        {w: 7000, h: 2400, t: '7000 х 2400 мм', p: 100000},
        {w: 6000, h: 4800, t: '6000 х 4800 мм', p: 160000},
        {w: 7000, h: 4800, t: '7000 х 4800 мм', p: 230000},
    ]
}

/**
 * Получение возможных шаблонов //todo получать с сервера
 */
function getKarkasTemlateToCreate() {
    return templates
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

let windowsEl = [];
let doorsEl = [];

function initElement() {
    let rs = JSON.parse(httpGet("http://localhost:8080/api/getAllElement"));
    if (rs) {
        rs.forEach(el => {
            switch (el.elementType) {
                case "WINDOW":
                    windowsEl.push(el);
                    break;
                case "DOOR":
                    doorsEl.push(el);
                    break;
            }
        })
    }
}

initElement();

function setFullScreenClick() {
    serialize();
    removeElement("low-screen");
    setFullScreen();
}

function createHtmlElement(type, {id, style, src, width, text, onClick, classV, html}) {
    let element = document.createElement(type);
    if (id) {
        element.setAttribute("id", id);
    }
    if (style) {
        element.setAttribute("style", style);
    }
    if (classV) {
        element.setAttribute("class", classV);
    }
    if (src) {
        element.setAttribute("src", src);
    }
    if (width) {
        element.setAttribute("width", width);
    }
    if (text) {
        element.innerText = text;
    }
    if (html) {
        element.innerHTML = html;
    }
    if (onClick) {
        element.addEventListener("click", function () {
            onClick()
        });
    }
    return element;
}

//-------------------------------------------end -------------------------/

// ------------------------------ Обработка html кнопок  -------------//

addElement = () => {
    if (karkas) {
        confirmAllShapes();
        new Arrow(new Partition(karkas), POSITION.TOP, colorBlack);
        drawAll();
    }
};

addLight = () => {
    if (karkas) {
        confirmAllShapes();
        new Light(karkas);
        drawAll();
    }
};

addDoor = (width, price, name) => {
    if (karkas) {
        confirmAllShapes();
        new Arrow(new Door(karkas, width, price, name), POSITION.TOP, colorBlack);
        drawAll();
    }
};

addWindow = (width, price, name) => {
    if (karkas) {
        confirmAllShapes();
        new Arrow(new Window(karkas, width, price, name), POSITION.BOTTOM, colorBlack);
        drawAll();
    }
};

setKarkas = (width, heigth, price) => {
    shapes = [];
    scale = defScaleValue;
    if (heigth > 2400) {
        canvas.height = window.innerHeight * 0.75
    }
    karkas = new Karkas(100, 70, width, heigth, baseColor, true, price);
    new Arrow(karkas, POSITION.TOP, colorBlack, width + " мм");
    new Arrow(karkas, POSITION.LEFT, colorBlack, heigth + " мм");
    let door = new Door(karkas);
    door.price = undefined;
    door.base = true;
    new Arrow(door, POSITION.TOP, colorBlack);
    new Arrow(new Window(karkas), POSITION.TOP, colorBlack);
    drawAll();
    serialize()
};

//-------------------------------------------end -------------------------/

// ------------------------------ Классы элементов конструктора  -------------//

/**
 * Базоывй класс фигур для отрисовки
 *
 */
class Shape {
    /**
     * Идентификатор фигуры
     */
    id;
    /**
     * Координата х верхней левой точки
     */
    x;
    /**
     * Координата у верхней левой точки
     */
    y;
    /**
     * Ширина элемента
     */
    width;
    /**
     * Высота элемента
     */
    height;
    /**
     * Цвет линии элемента
     */
    color;
    /**
     * Текст который относится к фигуре
     */
    text;
    /**
     * Признак, что элемент не перетаскивается
     */
    notDragable;
    /**
     * Признак что данная фигура зафиксирована
     */
    fixed;
    /**
     * Признак удаления, при следующем рендере данная фигура удаляется
     */
    deleted;
    /**
     * Наименоние фигуры
     * @type {string}
     */
    name = 'Shape';

    parentId;

    arrowsId = [];


    constructor(x, y, width, height, color, text, notDragable) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.text = text;
        this.notDragable = !!notDragable;
        this.fixed = true;
        let id = uuidv4();
        this.id = id;
        shapesMap.set(id, this);
        shapes.push(this)
    }

    getParent() {
        let parent;
        if (this.parentId) {
            parent = shapesMap.get(this.parentId)
        }
        return parent;
    }

    getX() {
        return this.x;
    }

    getX3D() {
        return this.getX()
    }

    getY3D() {
        return this.getY()
    }

    getY() {
        return this.y;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    draw = function (ctx) {
        console.info("Method draw not implemented")
    };

    getId = () => {
        return this.id;
    };

    onClick = () => {
        console.info("Method onClick not implemented");
    };

    confirm = () => {

    };

    turn = () => {
        turnShape(this)
    };

    mirroring = () => {
    };

    setDeleted() {
        shapes.filter(item => item.parentId === this.getId()).forEach(item => item.setDeleted());
        setDeleteAllShapeInArrId(this.relatedShapes);
        setDeleteAllShapeInArrId(this.arrowsId);
        this.deleted = true;
    }

    sort = (a, b) => {
        return a.getX() - b.getX();
    };
}

class RelatedShape extends Shape {
    _shiftX;
    _shiftY;

    constructor(parent, _shiftX, _shiftY) {
        super();
        this.parentId = parent && parent.getId();
        this._shiftX = _shiftX;
        this._shiftY = _shiftY;
    }


    /**
     * used
     * @see Rectangle
     */
    static createTurnButton(shape, _shiftX, _shiftY) {
        let btn = new TurnButton(shape, _shiftX, _shiftY);
        return btn.getId();
    }

    static createConfirmButton(shape, shiftX, shiftY) {
        let btn = new ConfirmButton(shape, shiftX, shiftY);
        return btn.getId();
    }

    /**
     * used
     * @see Rectangle
     */
    static createDeleteButton(shape, shiftX, shiftY) {
        let btn = new DeleteButton(shape, shiftX, shiftY);
        return btn.getId();
    }

    static createEditButton(shape, shiftX, shiftY) {
        let btn = new EditButton(shape, shiftX, shiftY);
        return btn.getId();
    }

    static createChangeSizeElement(shape, isFirst) {
        let btn = new ChangeSizeElement(shape);
        btn.isFirst = isFirst;
        return btn.getId();
    }

    static createDragElement(shape, shiftX, shiftY) {
        let btn = new DragElement(shape, shiftX, shiftY);
        return btn.getId();
    }

    /**
     * used
     * @see Door
     */
    static createMirrorButton(shape, shiftX, shiftY) {
        let btn = new MirrorButton(shape, shiftX, shiftY);
        return btn.getId();
    }

    /**
     * used
     * @see Rectangle
     */
    static createAddDoorButton(shape, shiftX, shiftY) {
        let btn = new AddInnerDoorButton(shape, shiftX, shiftY);
        return btn.getId();
    }

    /**
     * used
     * @see Door
     */
    static createChangeOpenButton(shape, shiftX, shiftY) {
        let btn = new ChangeOpenTypeButton(shape, shiftX, shiftY);
        return btn.getId();
    }

    getShiftX() {
        return this._shiftX;
    }

    setShiftX(value) {
        this._shiftX = value;
    }

    getShiftY() {
        return this._shiftY;
    }

    setShiftY(value) {
        this._shiftY = value;
    }
}

class Door extends Shape {

    relatedShapes = [];
    shift = 25;
    position = POSITION.BOTTOM;
    direction = DIRECTION.RIGHT;
    opening = OPENING_TYPE.OUT;
    name = "Door";
    nameRu = 'дверь';
    price = 5000;
    printName;

    constructor(parent, width, price, name) {
        if (parent) {
            var x = parent.x + ((parent.width / 2) - (doorWidth / 2)) / scale;
            var y = parent.y - karkasDepth + (parent.height) / scale;
            super(x, y, width || doorWidth, karkasDepth, colorBlack);
            this.shift = this.calculateShift(x, parent);
            this.parentId = parent.getId();
            this.price = price;
            this.printName = name;
        } else {
            super();
        }
    }

    calculateShift(x, parent, shift) {
        shift = shift || ((x - parent.x) / (parent.width / scale)) * 100;
        if (shapes.filter(filterBottomDoor).filter(item => Math.abs(item.shift - shift) < 5).length > 0) {
            shift = this.calculateShift(x, parent, shift > 80 ? 1 : shift + 13.5)
        }
        return shift;
    }

    getWidth() {
        switch (this.position) {
            case POSITION.BOTTOM:
            case POSITION.TOP:
                return doorWidth;
            case POSITION.LEFT:
            case POSITION.RIGHT:
                return karkasDepth;
        }
        return doorWidth;
    }

    getHeight() {
        switch (this.position) {
            case POSITION.BOTTOM:
            case POSITION.TOP:
                return karkasDepth;
            case POSITION.LEFT:
            case POSITION.RIGHT:
                return doorWidth;
        }
        return karkasDepth;
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            let parentWidth = parent.getWidth() / scale;
            let parentHeight = parent.getHeight() / scale;
            let parentX = parent.getX();
            let shift = this.shift;

            switch (this.position) {
                case POSITION.TOP:
                case POSITION.BOTTOM:
                    return (shift / 100) * parentWidth + parentX;
                case POSITION.RIGHT:
                    return parentX + parentWidth - (karkasDepth * defScaleValue / scale);
                case POSITION.LEFT:
                    return parentX;
            }
        }
    }

    getX3D() {
        return this.getX()
    }

    getY3D() {
        let parent = this.getParent();
        if (parent) {
            let parentWidth = parent.getWidth() / scale;
            let parentHeight = parent.getHeight() * y3dcefficient / scale;
            let parentY = parent.getY();
            let shift = this.shift;

            switch (this.position) {
                case POSITION.TOP:
                    return parentY;
                case POSITION.BOTTOM:
                    return parentY + parentHeight - (karkasDepth * defScaleValue / scale);
                case POSITION.RIGHT:
                case POSITION.LEFT:
                    return (shift / 100) * parentHeight + parentY;
            }
        }
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            let parentWidth = parent.getWidth() / scale;
            let parentHeight = parent.getHeight() / scale;
            let parentY = parent.getY();
            let shift = this.shift;

            switch (this.position) {
                case POSITION.TOP:
                    return parentY;
                case POSITION.BOTTOM:
                    return parentY + parentHeight - (karkasDepth * defScaleValue / scale);
                case POSITION.RIGHT:
                case POSITION.LEFT:
                    return (shift / 100) * parentHeight + parentY;
            }
        }
    }

    setX(x) {
        let parent = this.getParent();
        if (parent) {
            let parentX = parent.getX();
            let parentWidth = parent.getWidth();
            let parentHeight = parent.getHeight() / scale;
            switch (this.position) {
                case POSITION.TOP:
                case POSITION.BOTTOM:
                    if (parentX + karkasDepth < x && (parentX - karkasDepth + parentWidth / scale) > (x + this.width / scale)) {
                        this.shift = ((x - parentX) / (parentWidth / scale)) * 100
                    } else if ((parentX + parentWidth / scale) < mouseX) {
                        this.shift = this.position === POSITION.TOP ? karkasDepth * 100 / parentHeight : ((parentHeight - karkasDepth - this.getWidth() / scale) / parentHeight) * 100;
                        let arrow = getShapeById(this.arrowsId[0]);
                        arrow && (arrow.type = POSITION.LEFT);
                        this.position = POSITION.RIGHT;
                        this.revertSize()
                    } else if (parentX > mouseX) {
                        this.shift = this.position === POSITION.TOP ? karkasDepth * 100 / parentHeight : ((parentHeight - karkasDepth - this.getWidth() / scale) / parentHeight) * 100;
                        let arrow = getShapeById(this.arrowsId[0]);
                        arrow && (arrow.type = POSITION.RIGHT);
                        this.position = POSITION.LEFT;
                        this.revertSize()
                    }
                    break;
                case POSITION.RIGHT:
                case POSITION.LEFT:
            }
        }
    }

    setY(y) {
        let parent = this.getParent();
        if (parent) {
            let parentY = parent.getY();
            let parentWidth = parent.getWidth() / scale;
            let parentHeight = parent.getHeight() / scale;

            switch (this.position) {
                case POSITION.TOP:
                case POSITION.BOTTOM:
                    break;
                case POSITION.RIGHT:
                case POSITION.LEFT:
                    if (parentY + karkasDepth < y && (parentY - karkasDepth + parentHeight) > (y + this.height / scale)) {
                        this.shift = ((y - parentY) / parentHeight) * 100
                    } else if ((parentY + parentHeight) < mouseY) {
                        let arrow = getShapeById(this.arrowsId[0]);
                        arrow && (arrow.type = POSITION.TOP);
                        this.shift = this.position === POSITION.LEFT ? karkasDepth * 100 / parentWidth : ((parentWidth - karkasDepth - this.getHeight() / scale) / parentWidth) * 100;
                        this.position = POSITION.BOTTOM;
                        this.revertSize()
                    } else if (parentY > mouseY) {
                        this.shift = this.position === POSITION.LEFT ? karkasDepth * 100 / parentWidth : ((parentWidth - karkasDepth - this.getHeight() / scale) / parentWidth) * 100;
                        let arrow = getShapeById(this.arrowsId[0]);
                        arrow && (arrow.type = POSITION.BOTTOM);
                        this.position = POSITION.TOP;
                        this.revertSize()
                    }
            }
        }

    }

    revertSize() {
        let height = this.height;
        this.height = this.width;
        this.width = height;
        this.confirm();
        this.fixed = false;
        drawAll()
    }

    confirm = () => {
        this.fixed = true;
        this.relatedShapes.forEach(item => shapes.filter(i => i.id === item)[0].deleted = true);
        this.relatedShapes = [];
    };
    edit = () => {
        selectDoor(document.getElementById(rootDivId), this.getId())
    };

    draw = function (ctx) {
        if (!this.fixed && this.relatedShapes.length == 0) {
            switch (this.position) {
                case POSITION.BOTTOM:
                case POSITION.TOP:
                    !this.base && this.relatedShapes.push(RelatedShape.createDeleteButton(this, -getScaleValue(40), -getScaleValue(35)));
                    this.base && this.relatedShapes.push(RelatedShape.createEditButton(this, -getScaleValue(40), -getScaleValue(35)));
                    this.relatedShapes.push(RelatedShape.createMirrorButton(this, -getScaleValue(10), -getScaleValue(35)));
                    this.relatedShapes.push(RelatedShape.createChangeOpenButton(this, getScaleValue(20), -getScaleValue(35)));
                    this.relatedShapes.push(RelatedShape.createDragElement(this, (this.getWidth() / 2 / scale), karkasDepth / 2));
                    break;
                case POSITION.RIGHT:
                case POSITION.LEFT:
                    !this.base && this.relatedShapes.push(RelatedShape.createDeleteButton(this, getScaleValue(15), getScaleValue(15)));
                    this.base && this.relatedShapes.push(RelatedShape.createEditButton(this, getScaleValue(15), getScaleValue(15)));
                    this.relatedShapes.push(RelatedShape.createMirrorButton(this, getScaleValue(15), getScaleValue(15)));
                    this.relatedShapes.push(RelatedShape.createChangeOpenButton(this, getScaleValue(15), getScaleValue(40)));
                    this.relatedShapes.push(RelatedShape.createDragElement(this, karkasDepth / 2, (this.getHeight() / 2 / scale)));
                    break;
            }
        }
        //фигура
        // ctx.save();
        switch (this.position) {
            case POSITION.BOTTOM:
                drawGorizontalDoor(ctx,
                    this.getX(),
                    this.getY(),
                    this.getWidth() / scale,
                    this.getHeight() * defScaleValue / scale,
                    this.opening,
                    this.direction);
                break;
            case POSITION.TOP:
                drawGorizontalDoor(ctx,
                    this.getX(),
                    this.getY(),
                    this.getWidth() / scale,
                    this.getHeight() * defScaleValue / scale,
                    this.opening == OPENING_TYPE.OUT ? OPENING_TYPE.IN : OPENING_TYPE.OUT,
                    this.direction == DIRECTION.LEFT ? DIRECTION.RIGHT : DIRECTION.LEFT);
                break;
            case POSITION.LEFT:
                drawVertikalDoor(ctx,
                    this.getX(),
                    this.getY(),
                    this.getWidth() * defScaleValue / scale,
                    this.getHeight() / scale,
                    this.opening == OPENING_TYPE.OUT ? OPENING_TYPE.IN : OPENING_TYPE.OUT,
                    this.direction == DIRECTION.LEFT ? DIRECTION.RIGHT : DIRECTION.LEFT);
                break;
            case POSITION.RIGHT:
                drawVertikalDoor(ctx,
                    this.getX(),
                    this.getY(),
                    this.getWidth() * defScaleValue / scale,
                    this.getHeight() / scale,
                    this.opening,
                    this.direction);
                break;
            default:
                break;
        }


        return this;
    };

    mirroring = () => {
        switch (this.direction) {
            case DIRECTION.LEFT:
                this.direction = DIRECTION.RIGHT;
                break;
            case DIRECTION.RIGHT:
                this.direction = DIRECTION.LEFT;
        }
    };

    changeOpen = () => {
        let arrow = getShapeById(this.arrowsId[0]);
        switch (this.opening) {
            case OPENING_TYPE.IN:
                this.opening = OPENING_TYPE.OUT;
                if (arrow) {
                    switch (arrow.type) {
                        case "BOTTOM":
                            arrow.type = POSITION.TOP;
                            break;
                        case "TOP":
                            arrow.type = POSITION.BOTTOM;
                            break;
                        case POSITION.LEFT:
                            arrow.type = POSITION.RIGHT;
                            break;
                        case POSITION.RIGHT:
                            arrow.type = POSITION.LEFT;
                            break;
                    }
                }
                break;
            case OPENING_TYPE.OUT:
                this.opening = OPENING_TYPE.IN;
                if (arrow) {
                    switch (arrow.type) {
                        case "BOTTOM":
                            arrow.type = POSITION.TOP;
                            break;
                        case "TOP":
                            arrow.type = POSITION.BOTTOM;
                            break;
                        case POSITION.LEFT:
                            arrow.type = POSITION.RIGHT;
                            break;
                        case POSITION.RIGHT:
                            arrow.type = POSITION.LEFT;
                            break;
                    }
                }
        }
    }
}

class InnerDoor extends Shape {

    relatedShapes = [];
    shift = 25;
    direction = DIRECTION.RIGHT;
    opening = OPENING_TYPE.OUT;
    position = POSITION.BOTTOM;
    name = "InnerDoor";
    nameRu = 'дверь';
    printName

    constructor(parent, price, name) {
        if (parent) {
            let height = parent.getHeight() / scale;
            let width = parent.getWidth() / scale;
            let isGorizontal = width > height;
            let x = parent.x + ((parent.width / 4) - (doorWidth / 2)) / scale;
            let y = parent.y - karkasDepth + (parent.height) / scale;
            super(x, y, doorWidth, defPartitionHeight, colorBlack);
            this.shift = 50;
            this.parentId = parent.getId();
            this.position = isGorizontal ? POSITION.BOTTOM : POSITION.RIGHT;
            this.price = price;
            this.printName = name;
            this.hint = name
        } else {
            super();
        }
    }

    getWidth() {
        switch (this.position) {
            case POSITION.BOTTOM:
            case POSITION.TOP:
                return doorWidth;
            case POSITION.LEFT:
            case POSITION.RIGHT:
                return defPartitionHeight;
        }
    }

    getHeight() {
        switch (this.position) {
            case POSITION.BOTTOM:
            case POSITION.TOP:
                return defPartitionHeight;
            case POSITION.LEFT:
            case POSITION.RIGHT:
                return doorWidth;
        }
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            let parentWidth = parent.getWidth() / scale;
            let parentHeight = parent.getHeight() / scale;
            let parentX = parent.getX();
            let shift = this.shift;

            switch (this.position) {
                case POSITION.TOP:
                case POSITION.BOTTOM:
                    return (shift / 100) * parentWidth + parentX;
                case POSITION.RIGHT:
                    return parentX + parentWidth - (defPartitionHeight / scale);
                case POSITION.LEFT:
                    return parentX;
            }
        }
    }

    getX3D() {
        return this.getX()
    }

    getY3D() {
        return this.getY()
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            let parentWidth = parent.getWidth() / scale;
            let parentHeight = parent.getHeight() / scale;
            let parentY = parent.getY();
            let shift = this.shift;

            switch (this.position) {
                case POSITION.TOP:
                    return parentY;
                case POSITION.BOTTOM:
                    return parentY + parentHeight - defPartitionHeight / scale;
                case POSITION.RIGHT:
                case POSITION.LEFT:
                    return (shift / 100) * parentHeight + parentY;
            }
        }
    }

    setX(x) {
        let parent = this.getParent();
        if (parent) {
            let parentX = parent.getX();
            let parentWidth = parent.getWidth() / scale;
            let parentHeight = parent.getHeight() / scale;
            switch (this.position) {
                case POSITION.TOP:
                case POSITION.BOTTOM:
                    if (parentX < x && (parentX + parentWidth) > (x + this.getWidth() / scale)) {
                        this.shift = ((x - parentX) / parentWidth) * 100
                    }
                    break;
                case POSITION.RIGHT:
                case POSITION.LEFT:
            }
        }
    }

    setY(y) {
        let parent = this.getParent();
        if (parent) {
            let parentY = parent.getY();
            let parentWidth = parent.getWidth() / scale;
            let parentHeight = parent.getHeight() / scale;
            switch (this.position) {
                case POSITION.TOP:
                case POSITION.BOTTOM:
                    break;
                case POSITION.RIGHT:
                case POSITION.LEFT:
                    if (parentY < y && (parentY + parentHeight) > (y + this.getHeight() / scale)) {
                        this.shift = ((y - parentY) / parentHeight) * 100
                    }
            }
        }
    }

    revertSize() {
        let height = this.height;
        this.height = this.width;
        this.width = height;
        this.confirm();
        this.fixed = false;
        drawAll()
    }

    confirm = () => {
        this.fixed = true;
        this.relatedShapes.forEach(item => shapes.filter(i => i.id === item)[0].deleted = true);
        this.relatedShapes = [];
    };

    draw = function (ctx) {
        if (!this.fixed && this.relatedShapes.length == 0) {
            switch (this.position) {
                case POSITION.BOTTOM:
                case POSITION.TOP:
                    this.relatedShapes.push(RelatedShape.createDeleteButton(this, -getScaleValue(40), this.opening === OPENING_TYPE.IN ? -getScaleValue(30) : getScaleValue(20)));
                    this.relatedShapes.push(RelatedShape.createMirrorButton(this, -getScaleValue(10), this.opening === OPENING_TYPE.IN ? -getScaleValue(30) : getScaleValue(20)));
                    this.relatedShapes.push(RelatedShape.createChangeOpenButton(this, getScaleValue(20), this.opening === OPENING_TYPE.IN ? -getScaleValue(30) : getScaleValue(20)));
                    this.relatedShapes.push(RelatedShape.createDragElement(this, (this.getWidth() / 2 / scale) + getScaleValue(60), this.opening === OPENING_TYPE.IN ? -getScaleValue(20) : getScaleValue(30)));
                    break;
                case POSITION.RIGHT:
                case POSITION.LEFT:
                    this.relatedShapes.push(RelatedShape.createDeleteButton(this, this.opening == OPENING_TYPE.OUT ? getScaleValue(30) : -getScaleValue(30), getScaleValue(25)));
                    this.relatedShapes.push(RelatedShape.createMirrorButton(this, this.opening == OPENING_TYPE.OUT ? getScaleValue(30) : -getScaleValue(30), getScaleValue(54)));
                    this.relatedShapes.push(RelatedShape.createChangeOpenButton(this, this.opening == OPENING_TYPE.OUT ? getScaleValue(30) : -getScaleValue(30), getScaleValue(35)));
                    this.relatedShapes.push(RelatedShape.createDragElement(this, this.opening == OPENING_TYPE.OUT ? getScaleValue(40) : -getScaleValue(20), (this.getHeight() / 2 / scale) - getScaleValue(25)));
                    break;
            }
        }
        //фигура
        // ctx.save();
        switch (this.position) {
            case POSITION.BOTTOM:
                drawGorizontalDoor(ctx,
                    this.getX(),
                    this.getY(),
                    this.getWidth() / scale,
                    this.getHeight() / scale,
                    this.opening,
                    this.direction, true);
                break;
            case POSITION.TOP:
                drawGorizontalDoor(ctx,
                    this.getX(),
                    this.getY(),
                    this.getWidth() / scale,
                    this.getHeight() / scale,
                    this.opening == OPENING_TYPE.OUT ? OPENING_TYPE.IN : OPENING_TYPE.OUT,
                    this.direction == DIRECTION.LEFT ? DIRECTION.RIGHT : DIRECTION.LEFT, true);
                break;
            case POSITION.LEFT:
                drawVertikalDoor(ctx,
                    this.getX(),
                    this.getY(),
                    this.getWidth() / scale,
                    this.getHeight() / scale,
                    this.opening == OPENING_TYPE.OUT ? OPENING_TYPE.IN : OPENING_TYPE.OUT,
                    this.direction == DIRECTION.LEFT ? DIRECTION.RIGHT : DIRECTION.LEFT);
                break;
            case POSITION.RIGHT:
                drawVertikalDoor(ctx,
                    this.getX(),
                    this.getY(),
                    this.getWidth() / scale,
                    this.getHeight() / scale,
                    this.opening,
                    this.direction);
                break;
            default:
                break;

        }


        return this;
    };

    mirroring = () => {
        switch (this.direction) {
            case DIRECTION.LEFT:
                this.direction = DIRECTION.RIGHT;
                break;
            case DIRECTION.RIGHT:
                this.direction = DIRECTION.LEFT;
        }
    };

    changeOpen = () => {
        let arrow = getShapeById(this.arrowsId[0]);
        switch (this.opening) {
            case OPENING_TYPE.IN:
                this.opening = OPENING_TYPE.OUT;
                arrow && (arrow.type = POSITION.TOP);
                break;
            case OPENING_TYPE.OUT:
                this.opening = OPENING_TYPE.IN;
                arrow && (arrow.type = POSITION.BOTTOM);
        }
    }
}

class Window extends Shape {

    relatedShapes = [];
    shift = 25;
    position = POSITION.BOTTOM;
    name = 'Window';
    nameRu = 'окно';
    price;

    constructor(parent, width, price, name) {
        if (parent) {
            let karkasDepth1 = karkasDepth * defScaleValue / scale;
            var x = parent.getX() + ((parent.getWidth() / 4) - (windowWidth / 2)) / scale;
            var y = parent.getY() - karkasDepth1 + (parent.getHeight()) / scale;
            super(x, y, width || windowWidth, karkasDepth1, colorBlack);
            this.shift = this.calculateShift(x, parent);
            this.position = POSITION.BOTTOM;
            this.parentId = parent.getId();
            this.price = price;
            this.hint = name
        } else {
            super()
        }
        // this.positionTop = ((y - parent.y)/ (parent.height / scale)) * 100;
    }

    calculateShift(x, parent, shift) {
        shift = shift || ((x - parent.getX()) / (parent.getWidth() / scale)) * 100;
        if (shapes.filter(filterBottomWindow).filter(item => Math.abs(item.shift - shift) < 5).length > 0) {
            shift = this.calculateShift(x, parent, shift > 80 ? 1 : shift + 13.5)
        }
        return shift;
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            return (this.shift / 100) * parent.getWidth() / scale + parent.getX();
        }
    }

    getX3D() {
        return this.getX()
    }

    getY3D() {
        let karkasDepth1 = karkasDepth * defScaleValue / scale;
        let parent = this.getParent();
        if (parent) {
            switch (this.position) {
                case POSITION.TOP:
                    return parent.getY();
                case POSITION.BOTTOM:
                    return parent.getY() - karkasDepth1 + (parent.getHeight() * y3dcefficient) / scale;
                default:
                    return parent.getY();
            }
        }
    }

    getY() {
        let karkasDepth1 = karkasDepth * defScaleValue / scale;
        let parent = this.getParent();
        if (parent) {
            switch (this.position) {
                case POSITION.TOP:
                    return parent.getY();
                case POSITION.BOTTOM:
                    return parent.getY() - karkasDepth1 + (parent.getHeight()) / scale;
                default:
                    return parent.getY();
            }
        }
    }


    setX(x) {
        let parent = this.getParent();
        let karkasDepth1 = karkasDepth * defScaleValue / scale;
        if (parent) {
            if (parent.getX() + karkasDepth1 < x && (parent.getX() - karkasDepth1 + parent.getWidth() / scale) > (x + this.getWidth() / scale)) {
                this.shift = ((x - parent.getX()) / (parent.getWidth() / scale)) * 100
            }
        }
    }

    setY(y) {

    }

    confirm = () => {
        this.fixed = true;
        this.relatedShapes.forEach(item => shapes.filter(i => i.id === item)[0] && (shapes.filter(i => i.id === item)[0].deleted = true));
        this.relatedShapes = [];
    };

    draw = function (ctx) {
        let karkasDepth1 = karkasDepth * defScaleValue / scale;
        if (!this.fixed && this.relatedShapes.length == 0) {
            // this.relatedShapes.push(RelatedShape.createConfirmButton(this));
            // this.relatedShapes.push(RelatedShape.createTurnButton(this));
            this.relatedShapes.push(RelatedShape.createDeleteButton(this));
            this.relatedShapes.push(RelatedShape.createDragElement(this, this.getWidth() / 2 / scale, karkasDepth1 / 2));
        }
        //фигура
        // ctx.save();

        //белый фон для скрытия стенки
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.getX(), this.getY() - 1, (this.getWidth()) / scale, karkasDepth1 + 2);
        ctx.strokeStyle = colorWhite;
        ctx.stroke();
        ctx.fillStyle = colorWhite;
        ctx.fill()
        ctx.closePath();

        // ctx.beginPath();
        // ctx.strokeStyle = colorBlack;
        // ctx.arc(this.getX() + (this.getWidth()) / scale, this.getY() - 80, (doorWidth + 105) / scale, Math.PI * 2.5, Math.PI * 2.848, false);
        // ctx.stroke();
        // ctx.closePath();
        ctx.beginPath();

        ctx.moveTo(this.getX(), this.getY());
        ctx.lineTo(this.getX() + (this.getWidth()) / scale, this.getY());
        ctx.moveTo(this.getX(), this.getY() + karkasDepth1);
        ctx.lineTo(this.getX() + (this.getWidth()) / scale, this.getY() + karkasDepth1);

        ctx.strokeStyle = "rgba(0,0,0,0.41)";
        ctx.stroke();

        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(this.getX(), this.getY());
        ctx.lineTo(this.getX(), this.getY() + karkasDepth1);
        ctx.moveTo(this.getX() + (this.getWidth()) / scale, this.getY());
        ctx.lineTo(this.getX() + (this.getWidth()) / scale, this.getY() + karkasDepth1);
        // ctx.rect(this.getX(), this.getY(), (this.getWidth()) / scale, this.getHeight() );
        ctx.strokeStyle = "rgb(0,0,255)";
        ctx.stroke();

        ctx.closePath();
        ctx.restore();

        return this;
    };
}

/**
 * Фигура для поворота фигуры, круглая стрелка
 */
class TurnButton extends RelatedShape {

    name = 'TurnButton';
    hint = "Повернуть на 90 градусов";

    constructor(parent, shiftX = 30, shiftY = -34) {
        super(parent, shiftX, shiftY);
    }

    /**
     * У данной фигуры фиксированная ширина
     * @returns {number}
     */
    getWidth() {
        return getScaleValue(20);
    }

    /**
     * У данной фигуры фиксированная высота
     * @returns {number}
     */
    getHeight() {
        return getScaleValue(20);
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            let width = parent.getWidth() / scale;
            return parent.getX() + width / 2 + this.getShiftX();
        }
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            let height = parent.getHeight() / scale;
            return parent.getY() + height / 2 + this.getShiftY()
        }
    }

    draw = function (ctx) {
        // // раскоментировать для отображения области
        // ctx.beginPath();
        // ctx.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        // ctx.strokeStyle = 'rgba(0,0,0,0.23)';
        // ctx.stroke();
        // ctx.closePath();

        let value10 = getScaleValue(8);
        let value3 = getScaleValue(2);
        let value7 = getScaleValue(7);
        let value5 = getScaleValue(5);
        let value1 = getScaleValue(1);

        let centerX = this.getX() + this.getWidth() / 2;
        let centerY = this.getY() + this.getHeight() / 2;

        ctx.beginPath();


        ctx.strokeStyle = 'rgb(5,223,82)';
        ctx.arc(centerX, centerY, value10, 1, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(centerX + value10, centerY - value1);
        ctx.lineTo(centerX + value3, centerY - value5);
        ctx.moveTo(centerX + value10, centerY - value1);
        ctx.lineTo(centerX + value7, centerY - value10);
        ctx.lineTo(centerX + value3, centerY - value5);
        ctx.strokeStyle = 'rgb(5,223,82)';
        ctx.fillStyle = 'rgb(5,223,82)';
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    };

    onClick = () => {
        let parent = this.getParent();
        parent && parent.turn && parent.turn();
        drawAll();
    }

}

/**
 * Кнопка для подтверждения, галка
 */
class ConfirmButton extends RelatedShape {

    name = 'ConfirmButton';
    hint = "Закрепить элемент";

    constructor(shape, shiftX, shiftY) {
        if (!shiftX) shiftX = -10;
        if (!shiftY) shiftY = -30;
        super(shape, shiftX, shiftY);
        this.hint = `Закрепить ${shape.nameRu !== undefined ? shape.nameRu : 'элемент'}`;
        this.color = colorRed
    }

    getWidth() {
        return 25;
    }

    getHeight() {
        return 20;
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            return parent.getX() + (parent.getWidth() / 2 / scale) + this.getShiftX();
        }
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            return parent.getY() + this.getShiftY()
        }
    }


    draw = function (ctx) {
        ctx.beginPath();
        ctx.moveTo(this.getX() + 10, this.getY() + 20);
        ctx.lineTo(this.getX(), this.getY() + 10);
        ctx.moveTo(this.getX() + 10, this.getY() + 20);
        ctx.lineTo(this.getX() + 25, this.getY());
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    };

    onClick = () => {
        let parent = this.getParent();
        parent && parent.confirm && parent.confirm();
        serialize();
        drawAll();
    }
}

/**
 * Кнопка для подтверждения, галка
 */
class DeleteButton extends RelatedShape {

    name = 'DeleteButton';
    hint = "Удалить элемент";

    constructor(shape, shiftX, shiftY) {
        if (!shiftX) shiftX = 65;
        if (!shiftY) shiftY = -30;
        super(shape, shiftX, shiftY);
        this.hint = `Удалить ${shape.nameRu !== undefined ? shape.nameRu : 'элемент'}`;
        this.color = colorRed
    }

    getWidth() {
        return getScaleValue(14);
    }

    getHeight() {
        return getScaleValue(14);
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            return parent.getX() + (parent.getWidth() / 2 / scale) + this.getShiftX();
        }
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            return parent.getY() + (parent.getHeight() / 2 / scale) + this.getShiftY()
        }
    }

    draw = function (ctx) {
        drawWhiteRectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.beginPath();
        ctx.moveTo(this.getX(), this.getY());
        ctx.lineTo(this.getX() + this.getWidth(), this.getY() + this.getHeight());
        ctx.moveTo(this.getX() + this.getWidth(), this.getY());
        ctx.lineTo(this.getX(), this.getY() + this.getHeight());
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    };

    onClick = () => {
        this.deleted = true;
        let parent = this.getParent();
        parent && parent.setDeleted && parent.setDeleted();
        serialize();
        drawAll();
    }
}

class EditButton extends RelatedShape {

    name = 'EditButton';
    hint = "Редактировать элемент";

    constructor(shape, shiftX, shiftY) {
        if (!shiftX) shiftX = 65;
        if (!shiftY) shiftY = -30;
        super(shape, shiftX, shiftY);
        this.hint = `Изменить ${shape.nameRu !== undefined ? shape.nameRu : 'элемент'}`;
        this.color = baseColor
    }

    getWidth() {
        return getScaleValue(15);
    }

    getHeight() {
        return getScaleValue(15);
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            return parent.getX() + (parent.getWidth() / 2 / scale) + this.getShiftX();
        }
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            return parent.getY() + (parent.getHeight() / 2 / scale) + this.getShiftY()
        }
    }

    draw = function (ctx) {
        let x = this.getX();
        let y = this.getY();
        let w = this.getWidth();
        let h = this.getHeight();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x, y + h * 0.75);
        ctx.lineTo(x + w * 0.25, y + h);
        ctx.moveTo(x, y + h);

        ctx.moveTo(x + w * 0.1, y + h * 0.65);
        ctx.lineTo(x + w * 0.35, y + h * 0.90);
        ctx.lineTo(x + w * 0.65, y + h * 0.10);
        ctx.strokeStyle = colorBlack;
        ctx.fillStyle = colorBlack;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.drawImage(pencil, this.getX() + this.getWidth(), this.getY(), this.getWidth(), this.getHeight());
    };

    onClick = () => {
        let parent = this.getParent();
        parent && parent.edit && parent.edit();
        serialize();
        drawAll();
    }
}

/**
 * Кнопка для отзеркаливания
 */
class MirrorButton extends RelatedShape {

    name = 'MirrorButton';
    hint = "Левая/правая";

    constructor(shape, shiftX, shiftY) {
        if (!shiftX) shiftX = 65;
        if (!shiftY) shiftY = -30;
        super(shape, shiftX, shiftY);
        this.color = colorBlack
    }

    getWidth() {
        return getScaleValue(15);
    }

    getHeight() {
        return getScaleValue(15);
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            return parent.getX() + (parent.getWidth() / 2 / scale) + this.getShiftX();
        }
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            return parent.getY() + this.getShiftY()
        }
    }

    draw = function (ctx) {

        drawWhiteRectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.beginPath();
        drawMirror(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    };

    onClick = () => {
        let parent = this.getParent();
        parent && parent.mirroring && parent.mirroring();
        serialize();
        drawAll();
    }
}

/**
 * Кнопка для добавления двери на внутреннюю перегородку
 */
class AddInnerDoorButton extends RelatedShape {

    name = 'AddInnerDoorButton';
    hint = "Добавить дверь";

    constructor(shape, shiftX = 65, shiftY = -30) {
        super(shape, shiftX, shiftY);
        this.color = colorBlack
    }

    getWidth() {
        return getScaleValue(14);
    }

    getHeight() {
        return getScaleValue(16);
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            return parent.getX() + (parent.getWidth() / 2 / scale) + this.getShiftX();
        }
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            return parent.getY() + (parent.getHeight() / 2 / scale) + this.getShiftY()
        }
    }

    draw = function (ctx) {
        ctx.beginPath();
        drawAddDoor(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    };

    onClick = () => {
        let parent = this.getParent();
        if (parent) {
            selectDoor(document.getElementById(rootDivId), false, true, parent.getId());
        }
    }
}

/**
 * Кнопка для изменения типа открытия двери
 */
class ChangeOpenTypeButton extends RelatedShape {

    name = 'ChangeOpenTypeButton';
    hint = "Наружняя/внутренняя";

    constructor(shape, shiftX, shiftY) {
        if (!shiftX) shiftX = 65;
        if (!shiftY) shiftY = -30;
        super(shape, shiftX, shiftY);
        this.color = colorBlack
    }

    getWidth() {
        return getScaleValue(15);
    }

    getHeight() {
        return getScaleValue(15);
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            return parent.getX() + (parent.getWidth() / 2 / scale) + this.getShiftX();
        }
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            return parent.getY() + this.getShiftY()
        }
    }

    draw = function (ctx) {
        drawWhiteRectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.beginPath();
        drawChangeOpen(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    };

    onClick = () => {
        let parent = this.getParent();
        parent && parent.changeOpen && parent.changeOpen();
        serialize();
        drawAll();
    }
}

class DragElement extends RelatedShape {

    WIDTH = 20;
    HEIGHT = 20;
    hint = "Перемещение элемента";

    constructor(shape, shiftX, shiftY) {
        super(shape, shiftX - getScaleValue(20 / 2), shiftY - getScaleValue(20 / 2));
        this.color = colorBlack;
        this.hint = `Переместить ${shape.nameRu !== undefined ? shape.nameRu : 'элемент'}`;
    }

    name = "DragElement";

    getWidth() {
        return getScaleValue(this.WIDTH);
    }

    getHeight() {
        return getScaleValue(this.HEIGHT);
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            return parent.getX() + this.getShiftX();
        }
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            return parent.getY() + this.getShiftY()
        }
    }

    setY(y) {
        let parent = this.getParent();
        if (parent) {
            parent.setY(y - this.getShiftY());
        }
    }

    setX(x) {
        let parent = this.getParent();
        if (parent) {
            parent.setX(x - this.getShiftX());
        }
    }

    draw = function (ctx) {
        let parent = this.getParent();
        if (parent) {
            ctx.save()
            ctx.beginPath();
            //крестик
            drawCross(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.strokeStyle = this.color;
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            drawTopArrow(ctx, this.getX() + this.getWidth() / 2, this.getY(), 4, 7);
            drawBottomArrow(ctx, this.getX() + this.getWidth() / 2, this.getY() + this.getHeight(), 4, 7);
            drawLeftArrow(ctx, this.getX(), this.getY() + this.getHeight() / 2, 7, 4);
            drawRightArrow(ctx, this.getX() + this.getWidth(), this.getY() + this.getHeight() / 2, 7, 4);
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

            if (isDragging && (selectedShapeId === this.getId() || selectedShapeId === this.parentId)) {
                ctx.beginPath();
                if (parent instanceof Door || parent instanceof Window) {
                    if (parent.position === POSITION.BOTTOM) {

                        let karkasX = parent.getParent().getX();
                        let karkasY = parent.getParent().getY();
                        let karkasHeight = parent.getParent().getHeight() / scale;
                        let karkasWidth = parent.getParent().getWidth() / scale;

                        let dragElementX = parent.getX();
                        let dragElementWidth = parent.getWidth() / scale;
                        ctx.moveTo(karkasX, karkasY + karkasHeight);
                        ctx.lineTo(karkasX, karkasY + karkasHeight + (130 * 5 / scale));
                        ctx.moveTo(karkasX, karkasY + karkasHeight + 120 * 5 / scale);
                        ctx.lineTo(dragElementX, karkasY + karkasHeight + 120 * 5 / scale);
                        ctx.moveTo(dragElementX, karkasY + karkasHeight + 130 * 5 / scale);
                        ctx.lineTo(dragElementX, karkasY + karkasHeight);

                        ctx.fillStyle = "rgba(0,0,0,0.18)";
                        ctx.font = "italic 18pt Arial";
                        let text = parseInt((dragElementX - karkasX) * scale) + " мм";
                        ctx.fillText(text, karkasX + (dragElementX - karkasX) / 2, karkasY + karkasHeight + 90 * 5 / scale);

                        ctx.moveTo(karkasX + karkasWidth, karkasY + karkasHeight);
                        ctx.lineTo(karkasX + karkasWidth, karkasY + karkasHeight + 130 * 5 / scale);
                        ctx.moveTo(karkasX + karkasWidth, karkasY + karkasHeight + 120 * 5 / scale);
                        ctx.lineTo(dragElementX + dragElementWidth, karkasY + karkasHeight + 120 * 5 / scale);
                        ctx.moveTo(dragElementX + dragElementWidth, karkasY + karkasHeight + 130 * 5 / scale);
                        ctx.lineTo(dragElementX + dragElementWidth, karkasY + karkasHeight);

                        text = parseInt((karkasX + karkasWidth - dragElementX - dragElementWidth) * scale) + " мм";
                        ctx.fillText(text, dragElementX + dragElementWidth + (karkasX + karkasWidth - dragElementX - dragElementWidth) / 2,
                            karkasY + karkasHeight + 90 * 5 / scale);
                    }
                }
                if (parent instanceof Light) {


                    let karkasX = parent.getParent().getX();
                    let elX = parent.getX() + parent.getWidth() / 2 / scale;
                    let karkasY = parent.getParent().getY();
                    let elY = parent.getY() + parent.getWidth() / 2 / scale;

                    let karkasHeight = parent.getParent().getHeight() / scale;
                    let karkasWidth = parent.getParent().getWidth() / scale;

                    let dragElementX = parent.getX();
                    let dragElementY = parent.getY();
                    let dragElementWidth = parent.getWidth() / scale;
                    let dragElementHeight = parent.getHeight() / scale;

                    ctx.moveTo(karkasX, elY);
                    ctx.lineTo(dragElementX, elY);
                    ctx.setLineDash([20, 10]);

                    ctx.fillStyle = colorGrey;
                    ctx.font = "italic 18pt Arial";
                    let text = parseInt((dragElementX - karkasX) * scale) + " мм";
                    ctx.fillText(text, karkasX + (dragElementX - karkasX) / 2, elY - 50 / scale);

                    ctx.moveTo(karkasX + karkasWidth, elY);
                    ctx.lineTo(dragElementX + dragElementWidth, elY);
                    text = parseInt((karkasX + karkasWidth - dragElementX - dragElementWidth) * scale) + " мм";
                    ctx.fillText(text, dragElementX + dragElementWidth + (karkasX + karkasWidth - dragElementX - dragElementWidth) / 2,
                        elY - 50 / scale);

                    ctx.moveTo(elX, karkasY);
                    ctx.lineTo(elX, karkasY + karkasHeight);


                    text = parseInt((dragElementX - karkasX) * scale) + " мм";
                    ctx.strokeStyle = "rgba(0,0,0,0.18)";
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();

                    ctx.translate(elX, elY);
                    ctx.rotate(270 * Math.PI / 180);
                    text = parseInt((dragElementY - karkasY) * scale) + " мм";
                    ctx.fillText(text, (dragElementY - karkasY) / 2 - text.length * 7 / 2, -20);


                    text = parseInt((karkasY + karkasHeight - dragElementY - dragElementHeight) * scale) + " мм";
                    ctx.fillText(text, -(karkasY + karkasHeight - dragElementY + dragElementHeight) / 2 - text.length * 7 / 2, -20);

                }
                ctx.strokeStyle = "rgba(0,0,0,0.18)";
                ctx.stroke();

                ctx.closePath();
            }

            ctx.restore()
        }
    };

}

class Rectangle extends Shape {

    relatedShapes = [];
    name = 'Rectangle';

    doorId;
    price;

    constructor(x, y, width, height, color, notDragable, price) {
        super(x, y, width, height, color, undefined, !!notDragable);
        this.price = price;
    }

    confirm = () => {
        this.fixed = true;
        setDeleteAllShapeInArrId(this.relatedShapes)
        this.relatedShapes = [];
    };

    draw = function (ctx) {
        if (!this.fixed && this.relatedShapes.length == 0) {
            let door = this.getDoorIfExist();
            let height = this.getHeight() / scale;
            let width = this.getWidth() / scale;
            let isGorizontal = width > height;
            let scaleCoeff = defScaleValue / scale;
            let val3 = (3 * scaleCoeff > 3) ? 3 : 3 * scaleCoeff;
            let val34 = (34 * scaleCoeff > 34) ? 34 : 34 * scaleCoeff;
            let val35 = (35 * scaleCoeff > 35) ? 35 : 35 * scaleCoeff;
            let val30 = (30 * scaleCoeff > 30) ? 30 : 30 * scaleCoeff;
            let needAddDoor = (isGorizontal ? (this.getWidth() > doorWidth) : (this.getHeight() > doorWidth));

            this.relatedShapes.push(RelatedShape.createDragElement(this, this.getWidth() / 2 / scale, this.getHeight() / 2 / scale));
            this.relatedShapes.push(RelatedShape.createChangeSizeElement(this, true));
            this.relatedShapes.push(RelatedShape.createChangeSizeElement(this, false));
            let shifts = [];
            if (door) {
                if (isGorizontal) {
                    shifts = door.opening === OPENING_TYPE.IN ? [{x: 3, y: 15}, {x: 35, y: 18}, {x: -25, y: 18}] :
                        [{x: 3, y: undefined}, {x: 35, y: undefined}, {x: -25, y: -31}];
                } else {
                    shifts = door.opening === OPENING_TYPE.IN ? [{x: 19, y: -15}, {x: 20, y: 19}, {
                        x: 24,
                        y: -45
                    }] : [{x: -35, y: -15}, {x: -30, y: 19}, {x: -30, y: -45}];
                }
            } else {
                shifts = isGorizontal ? [{x: 3, y: -34}, {x: 35, y: -30}, {x: -25, y: -31}] :
                    [{x: 19, y: -15}, {x: 20, y: 19}, {x: 24, y: -45}];
            }
            this.relatedShapes.push(RelatedShape.createTurnButton(this,
                getScaleValue(Math.abs(shifts[0].x)) * shifts[0].x / Math.abs(shifts[0].x),
                !shifts[0].y ? undefined : getScaleValue(Math.abs(shifts[0].y)) * shifts[0].y / Math.abs(shifts[0].y)));
            this.relatedShapes.push(RelatedShape.createDeleteButton(this,
                getScaleValue(Math.abs(shifts[1].x)) * shifts[1].x / Math.abs(shifts[1].x),
                !shifts[1].y ? undefined : getScaleValue(Math.abs(shifts[1].y)) * shifts[1].y / Math.abs(shifts[1].y)));
            needAddDoor && this.relatedShapes.push(RelatedShape.createAddDoorButton(this,
                getScaleValue(Math.abs(shifts[2].x)) * shifts[2].x / Math.abs(shifts[2].x),
                !shifts[2].y ? undefined : getScaleValue(Math.abs(shifts[2].y)) * shifts[2].y / Math.abs(shifts[2].y)));
        }
        //фигура
        // ctx.save();
        if (this.rotate) {

        }
        let color = this.color;
        //предупреждение при пересечении//todo написать метод пресечения фигур
        shapes.forEach(item => {
            if (!(item instanceof Karkas) &&
                item.getId() !== this.getId() &&
                this.relatedShapes.indexOf(item.getId()) === -1 &&
                (!selectedShapeId || selectedShapeId === this.getId()) &&
                isMouseInShape(this.getX(), this.getY(), item)) {
                color = colorRed;
            }
        });

        ctx.save();
        ctx.beginPath();
        {
            // if(this.rotate){
            //     console.info('transform', this.rotate)
            //     ctx.translate(this.getX() + this.getWidth() / 2 , this.getY() + this.getHeight() / 2)
            //     ctx.rotate(this.rotate);
            //     // this.rotate = undefined
            // }
        }
        ctx.rect(this.getX(), this.getY(), (this.getWidth()) / scale, this.getHeight() / scale);
        ctx.strokeStyle = color;
        ctx.stroke();

        ctx.closePath();
        ctx.restore();

        return this;
    };

    _transform(dx, dy) {
        // console.info('transform', dx, dy)
        //     this.rotate = Math.atan2(dy , dx ) + Math.PI/2;
        // drawAll()

    }

    getDoorIfExist() {
        let door;
        if (this.doorId) {
            door = shapes.filter(item => item.getId() === this.doorId)[0];
        }
        return door;
    }
}

class Partition extends Rectangle {

    positionTop;
    positionRight;
    name = 'Partition';
    nameRu = 'перегородку';
    price;


    constructor(parent) {
        if (parent) {
            const defPartitionWidth = (parent.width / 3);
            var x = parent.x + ((parent.width / 2) - (defPartitionWidth / 2)) / scale;
            var y = parent.y + (parent.height / 2) / scale;
            super(x, y, defPartitionWidth, defPartitionHeight, baseColor);
            this.parentId = parent.getId();
            this.positionRight = ((x - parent.x) / (parent.width / scale)) * 100;
            this.positionTop = ((y - parent.y) / (parent.height / scale)) * 100;
            this.price = round(defPartitionWidth * price.partition1m, 2);
        } else {
            super()
        }
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            return (this.positionRight / 100) * parent.width / scale + parent.x;
        }
    }

    getX3D() {
        return this.getX()
    }

    getY3D() {
        return this.getY()
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            return (this.positionTop / 100) * parent.height / scale + parent.y;
        }
    }

    setX(x) {
        let parent = this.getParent();
        let thisWidth = this.width / scale;
        let karkasDepth1 = karkasDepth * defScaleValue / scale;
        if (parent) {
            if (parent.x + karkasDepth1 < x && (parent.x - karkasDepth1 + parent.width / scale) > (x + thisWidth)) {
                this.positionRight = ((x - parent.x) / (parent.width / scale)) * 100;
            } else if (parent.x + karkasDepth1 >= x) {
                this.positionRight = (karkasDepth1 / (parent.width / scale)) * 100;
            } else {
                this.positionRight = (((parent.width / scale) - karkasDepth1 - thisWidth) / (parent.width / scale)) * 100;
            }
            let magnetShapeX1 = magnetShapeX(this);
            if (magnetShapeX1) {
                this.setX(this.getX() + magnetShapeX1)
            }
        }
    }

    setY(y) {
        let parent = this.getParent();
        let thisHeight = this.getHeight() / scale;
        let karkasDepth1 = karkasDepth * defScaleValue / scale;
        if (parent) {
            if (parent.y + karkasDepth1 < y && (parent.y - karkasDepth1 + parent.height / scale) > (y + thisHeight)) {
                this.positionTop = ((y - parent.y) / (parent.height / scale)) * 100;
            } else if (parent.y + karkasDepth1 >= y) {
                this.positionTop = (karkasDepth1 / (parent.height / scale)) * 100;
            } else {
                this.positionTop = (((parent.height / scale) - karkasDepth1 - thisHeight) / (parent.height / scale)) * 100;
            }
        }
    }

    resize(dx, dy, isLeft) {
        let parent = this.getParent();
        let karkasDepth1 = karkasDepth * defScaleValue / scale;
        let door = this.getDoorIfExist();
        let minLength = door ? doorWidth + 40 : 100;
        if (parent) {
            if (this.width > this.height) {
                if (isLeft) {
                    let width = this.width - dx * scale;
                    if (width > minLength) {
                        if (this.getX() > parent.getX() + karkasDepth1 || dx > 0) {
                            this.positionRight = ((this.getX() + dx - parent.x) / (parent.width / scale)) * 100;
                            this.width -= dx * scale;
                        } else {
                            this.positionRight = ((karkasDepth1 / (parent.width / scale))) * 100;
                        }
                    }
                } else {
                    if ((this.getX() - parent.getX() + karkasDepth1 + (this.getWidth() + dx * scale) / scale) * scale < parent.getWidth()) {
                        let width = this.width + dx * scale;
                        if (width > minLength) this.width = width;
                    }
                }
                this.price = round(this.width, 2) * price.partition1m
            } else {
                if (isLeft) {
                    let height = this.height - dy * scale;
                    if (height > minLength) {
                        if (this.getY() > parent.getY() + karkasDepth1 || dy > 0) {
                            this.positionTop = ((this.getY() + dy - parent.getY()) / (parent.height / scale)) * 100;
                            this.height -= dy * scale;
                        } else {
                            this.positionTop = ((karkasDepth1 / (parent.height / scale))) * 100;
                        }
                    }
                } else {
                    if ((this.getY() - parent.getY() + karkasDepth1 + (this.getHeight() + dy * scale) / scale) * scale < parent.getHeight()) {
                        let height = this.height + dy * scale;
                        if (height > minLength) this.height += dy * scale;
                    }
                }
                this.price = round(this.height, 2) * price.partition1m
            }
            let innerParentHeight = (((parent.getHeight()) / scale) - karkasDepth1 * 2) * scale;

            if (this.getHeight() + karkasDepth * 2 >= innerParentHeight) {
                setDeleteAllShapeInArrId(this.arrowsId);
                this.arrowsId = [];
            } else {
                if (this.arrowsId.length === 0) {
                    new Arrow(this, POSITION.LEFT, colorBlack);
                }
            }
        }
    }

    turn = () => {
        turnShape(this);
        let parent = this.getParent();
        let karkasDepth1 = karkasDepth * defScaleValue / scale;
        let innerParentHeight = (((parent.getHeight()) / scale) - karkasDepth1 * 2) * scale;
        if (parent) {
            if (this.getHeight() + karkasDepth * 2 > innerParentHeight) {
                this.height = innerParentHeight;
                setDeleteAllShapeInArrId(this.arrowsId);
            }
        }
        this.confirm();
        this.fixed = false;
        let door = this.getDoorIfExist();
        if (door) {
            door.position = door.position === POSITION.BOTTOM ? POSITION.RIGHT : POSITION.BOTTOM;
        }
        this.setX(this.getX());
        this.setY(this.getY())
    };

}

class Light extends Shape {
    relatedShapes = [];
    positionTop;
    positionRight;
    name = 'Light';
    nameRu = 'светильник';
    price = price.light;

    constructor(parent) {
        if (parent) {
            var x = parent.x + (parent.width / 4) / scale;
            var y = parent.y + (parent.height / 2) / scale;
            super(x, y, 200, 200, colorGrey);
            this.parentId = parent.getId();
            try {
                this.positionRight = this.calculateShift(x, parent);
            } catch (e) {
                this.positionRight = ((x - parent.x) / (parent.width / scale)) * 100 + Math.random() * 20;
            }
            this.positionTop = ((y - parent.y) / (parent.height / scale)) * 100 - 5;
        } else {
            super()
        }
    }

    calculateShift(x, parent, shift) {
        shift = shift || ((x - parent.x) / (parent.width / scale)) * 100;
        if (shapes.filter(item => item.name === 'Light').filter(item => Math.abs(item.positionRight - shift) < 5).length > 0) {
            shift = this.calculateShift(x, parent, shift > 80 ? 1 : shift + 10)
        }
        return shift;
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            return (this.positionRight / 100) * parent.width / scale + parent.x;
        }
    }

    getX3D() {
        return this.getX()
    }

    getY3D() {
        return this.getY()
    }

    getY() {
        let parent = this.getParent();
        if (parent) {
            return (this.positionTop / 100) * parent.height / scale + parent.y;
        }
    }

    setX(x) {
        let parent = this.getParent();
        let thisWidth = this.width / scale;
        let karkasDepth1 = karkasDepth * defScaleValue / scale;
        if (parent) {
            if (parent.x + karkasDepth1 < x && (parent.x - karkasDepth1 + parent.width / scale) > (x + thisWidth)) {
                this.positionRight = ((x - parent.x) / (parent.width / scale)) * 100;
            } else if (parent.x + karkasDepth1 >= x) {
                this.positionRight = (karkasDepth1 / (parent.width / scale)) * 100;
            } else {
                this.positionRight = (((parent.width / scale) - karkasDepth1 - thisWidth) / (parent.width / scale)) * 100;
            }
            // let magnetShapeX1 = magnetShapeX(this);
            // if (magnetShapeX1) {
            //     this.setX(this.getX() + magnetShapeX1)
            // }
        }
    }

    setY(y) {
        let parent = this.getParent();
        let thisHeight = this.getHeight() / scale;
        let karkasDepth1 = karkasDepth * defScaleValue / scale;
        if (parent) {
            if (parent.y + karkasDepth1 < y && (parent.y - karkasDepth1 + parent.height / scale) > (y + thisHeight)) {
                this.positionTop = ((y - parent.y) / (parent.height / scale)) * 100;
            } else if (parent.y + karkasDepth1 >= y) {
                this.positionTop = (karkasDepth1 / (parent.height / scale)) * 100;
            } else {
                this.positionTop = (((parent.height / scale) - karkasDepth1 - thisHeight) / (parent.height / scale)) * 100;
            }
        }
    }

    confirm = () => {
        this.fixed = true;
        setDeleteAllShapeInArrId(this.relatedShapes);
        this.relatedShapes = [];
    };

    draw = function (ctx) {
        if (!this.fixed && this.relatedShapes.length == 0) {
            this.relatedShapes.push(RelatedShape.createDragElement(this, this.getWidth() / 2 / scale, this.getHeight() / 2 / scale));
            this.relatedShapes.push(RelatedShape.createDeleteButton(this, 15, -7));
        }

        let color = this.color;
        ctx.save();
        ctx.beginPath();
        let centerX = this.getX() + this.getWidth() / scale / 2;
        let centerY = this.getY() + this.getWidth() / scale / 2;
        ctx.arc(centerX, centerY, this.getWidth() / 2 / scale, 0, 2 * Math.PI);
        let crossLenght = (this.getWidth() - 50) / 2 / scale;
        ctx.moveTo(centerX - crossLenght, centerY - crossLenght);
        ctx.lineTo(centerX + crossLenght, centerY + crossLenght);
        ctx.moveTo(centerX + crossLenght, centerY - crossLenght);
        ctx.lineTo(centerX - crossLenght, centerY + crossLenght);
        ctx.strokeStyle = color;
        ctx.stroke();

        ctx.closePath();
        ctx.restore();

        return this;
    };

}

class Karkas extends Rectangle {

    name = 'Karkas';
    nameRu = 'Каркас';
    draw = function (ctx) {

        let karkasDepth1 = karkasDepth * defScaleValue / scale;

        ctx.save();
        ctx.beginPath();
        ctx.rect(this.getX(), this.getY(), (this.getWidth()) / scale, this.getHeight() / scale);
        ctx.rect(this.getX() + karkasDepth1, this.getY() + karkasDepth1, ((this.getWidth()) / scale) - karkasDepth1 * 2, (this.getHeight() / scale) - karkasDepth1 * 2);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        //верхняя пунктирная
        ctx.moveTo(this.getX() - 35, this.getY() + karkasDepth1 / 2);
        ctx.lineTo(this.getX() + (this.getWidth() / scale) + 35, this.getY() + karkasDepth1 / 2);
        //нижняя пунктирная
        ctx.moveTo(this.getX() - 35, this.getY() + this.getHeight() / scale - karkasDepth1 + karkasDepth1 / 2);
        ctx.lineTo(this.getX() + (this.getWidth() / scale) + 35, this.getY() + this.getHeight() / scale - karkasDepth1 + karkasDepth1 / 2);
        //левая пунктирная
        ctx.moveTo(this.getX() + karkasDepth1 / 2, this.getY() - 35);
        ctx.lineTo(this.getX() + karkasDepth1 / 2, this.getY() + (this.getHeight() / scale) + 35);
        //правая пунктирная
        ctx.moveTo(this.getX() + this.getWidth() / scale - karkasDepth1 + karkasDepth1 / 2, this.getY() - 35);
        ctx.lineTo(this.getX() + this.getWidth() / scale - karkasDepth1 + karkasDepth1 / 2, this.getY() + (this.getHeight() / scale) + 35);
        // ctx.lineWidth = 0.9;
        ctx.setLineDash([45, 25]);
        ctx.strokeStyle = "rgba(255,120,0,0.8)";
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        return this;
    };

    getX3D() {
        return this.getX()
    }

    getY3D() {
        return this.getY()
    }

    getXYZ1() {
        return super.getX();
    }

    getXYZ2() {
        return super.getX();
    }

    getXYZ3() {
        return super.getX();
    }

    getXYZ4() {
        return super.getX();
    }

    static from(json) {
        return Object.assign(new Karkas(), json);
    }
}

class ChangeSizeElement extends RelatedShape {

    isFirst;
    name = 'ChangeSizeElement';

    constructor(shape) {
        super(shape);
    }

    getX() {
        let parent = this.getParent();
        if (parent) {
            return this.isFirst ?
                parent.width > parent.height ?
                    parent.getX() - parent.height / 2 / scale - 3 : parent.getX() - 3
                :
                parent.width > parent.height ?
                    parent.getX() + parent.width / scale - parent.height / 2 / scale - 3 : parent.getX() + parent.width / 2 / scale - 5
        }
    }


    getY() {
        let parent = this.getParent();
        if (parent) {
            return this.isFirst ?
                parent.width > parent.height ?
                    parent.getY() - 3 : parent.getY() - 3 - parent.width / 2 / scale
                :
                parent.width > parent.height ?
                    parent.getY() - 3 : parent.getY() + parent.height / scale - 6
        }
    }

    getWidth() {
        return this.getHeight();
    }

    getHeight() {
        let parent = this.getParent();
        if (parent) {
            return parent.width > parent.height ?
                (parent.height / scale) + 6 : (parent.width / scale) + 6
        }

    }

    draw = function (ctx) {

        // ctx.beginPath();
        // ctx.rect(this.getX(), this.getY(), this.getWidth() + 5, this.getHeight() + 5);
        // ctx.strokeStyle = this.isFirst ? 'rgba(15,9,255,0.53)' : 'rgba(170,0,22,0.56)';
        // ctx.stroke();
        // ctx.closePath();
        let parent = this.getParent();
        if (parent) {
            ctx.beginPath();
            ctx.strokeStyle = colorBlack;
            ctx.fillStyle = colorBlack;


            if (this.isFirst) {
                if (parent.width > parent.height) {
                    ctx.arc(parent.getX(), parent.getY() + parent.height / 2 / scale, parent.height / 2 / scale + 1, 0, Math.PI * 2, false);
                } else {
                    ctx.arc(parent.getX() + parent.width / 2 / scale, parent.getY(), parent.width / 2 / scale + 1, 0, Math.PI * 2, false);
                }
            } else {
                if (parent.width > parent.height) {
                    ctx.arc(parent.getX() + parent.width / scale, parent.getY() + parent.height / 2 / scale, parent.height / 2 / scale + 1, 0, Math.PI * 2, false);
                } else {
                    ctx.arc(parent.getX() + parent.width / 2 / scale, parent.getY() + parent.height / scale, parent.width / 2 / scale + 1, 0, Math.PI * 2, false);

                }
            }
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }
    };

    resizeShape(dx, dy) {
        let parent = this.getParent();
        if (parent) {
            parent.resize && parent.resize(dx, dy, this.isFirst);
        }
    }

    onClick = () => {
        // this.shape.turn();
        // drawAll();
    }

}

class Arrow extends Shape {

    type;
    name = 'Arrow';

    constructor(releted, type, color, text) {
        if (releted) {
            super(releted.getX(), releted.getY() + (type === POSITION.TOP ? (-50) : (+50)),
                (type === POSITION.TOP || type === POSITION.BOTTOM) ? releted.width : releted.height,
                undefined, colorGrey, text, true);
            this.parentId = releted.getId();
            this.type = type;
            releted.arrowsId.push(this.getId());
        } else {
            super()
        }
    }

    draw = function (ctx) {

        let parent = this.getParent();
        if (parent) {
            let arrowWidth = 100 / scale > 20 ? 20 : 100 / scale;
            let arrowHeight = 50 / scale > 10 ? 10 : 50 / scale;
            let arrowFont = 90 / scale > 18 ? 18 : 90 / scale;
            let arrow60 = (60 * defScaleValue / scale) > 60 ? 60 : (60 * defScaleValue / scale);
            let arrow50 = (50 * defScaleValue / scale) > 50 ? 50 : (50 * defScaleValue / scale);
            let arrow45 = (45 * defScaleValue / scale) > 45 ? 45 : (45 * defScaleValue / scale);
            let arrow55 = (55 * defScaleValue / scale) > 55 ? 55 : (55 * defScaleValue / scale);


            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.moveTo(parent.getX(), parent.getY());
            if (this.type === POSITION.TOP || this.type === POSITION.BOTTOM) {
                ctx.lineTo(parent.getX(), parent.getY() + (this.type === POSITION.TOP ? (-arrow60) : (arrow60)));
                ctx.moveTo(parent.getX() + parent.getWidth() / scale, parent.getY());
                ctx.lineTo(parent.getX() + parent.getWidth() / scale, parent.getY() + (this.type === POSITION.TOP ? (-arrow60) : (arrow60)));
            } else {
                ctx.lineTo(parent.getX() + (this.type === POSITION.LEFT ? (-arrow60) : arrow60), parent.getY());
                ctx.moveTo(parent.getX(), parent.getY() + parent.getHeight() / scale);
                ctx.lineTo(parent.getX() + (this.type === POSITION.LEFT ? (-arrow60) : arrow60), parent.getY() + parent.getHeight() / scale);
            }
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.strokeStyle = this.color;
            if (this.type === POSITION.TOP || this.type === POSITION.BOTTOM) {
                ctx.moveTo(parent.getX(), parent.getY() + (this.type === POSITION.TOP ? (-arrow50) : (arrow50)));
                ctx.lineTo(parent.getX() + parent.getWidth() / scale, parent.getY() + (this.type === POSITION.TOP ? (-arrow50) : (arrow50)));
            } else {
                ctx.moveTo(parent.getX() + (this.type === POSITION.LEFT ? (-arrow50) : arrow50), parent.getY());
                ctx.lineTo(parent.getX() + (this.type === POSITION.LEFT ? (-arrow50) : arrow50), parent.getY() + parent.getHeight() / scale);
            }
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.strokeStyle = this.color;
            if (this.type === POSITION.TOP || this.type === POSITION.BOTTOM) {
                drawLeftArrow(ctx, parent.getX(), parent.getY() + (this.type === POSITION.TOP ? (-arrow50) : (+arrow50)), arrowWidth, arrowHeight)
            } else {
                drawTopArrow(ctx, parent.getX() + (this.type === POSITION.LEFT ? (-arrow50) : arrow50), parent.getY(), arrowHeight, arrowWidth)
            }
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.strokeStyle = this.color;
            if (this.type === POSITION.TOP || this.type === POSITION.BOTTOM) {
                drawRightArrow(ctx,
                    parent.getX() + parent.width / scale,
                    parent.getY() + (this.type === POSITION.TOP ? (-arrow50) : arrow50), arrowWidth, arrowHeight)
            } else {
                drawBottomArrow(ctx,
                    parent.getX() + (this.type === POSITION.LEFT ? (-arrow50) : arrow50),
                    parent.getY() + parent.getHeight() / scale, arrowHeight, arrowWidth)
            }
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.save();
            ctx.fillStyle = "#000000";
            // ctx.font = item.size + "pt";
            ctx.font = "italic " + arrowFont + "pt Arial";
            let text = !!this.text ? this.text : (((this.type === POSITION.TOP || this.type === POSITION.BOTTOM) ? Math.round(parent.getWidth()) : Math.round(parent.getHeight())) + " мм");
            let textX = (this.type === POSITION.TOP || this.type === POSITION.BOTTOM) ?
                (parent.getX() + (parent.width / 2) / scale - text.length * 30 / scale) :
                this.type === POSITION.LEFT ? parent.getX() - arrow55 : parent.getX() + arrow45;
            let textY = this._getTextPositionY(this.type, arrow55, arrow45);
            if (this.type === POSITION.RIGHT) {
                ctx.translate(textX, textY);
                ctx.rotate(270 * Math.PI / 180);
                ctx.fillText(text, -parent.getHeight() / 2 / scale - text.length * 30 / scale, 0);
            } else if (this.type === POSITION.LEFT) {
                ctx.translate(textX, textY);
                ctx.rotate(270 * Math.PI / 180);
                ctx.fillText(text, -parent.getHeight() / 2 / scale - text.length * 30 / scale, 0);
            } else {
                ctx.fillText(text, textX, textY);
            }

            ctx.restore();
            ctx.closePath();
        }
    };

    _getTextPositionY(type, position55, position45) {
        let parent = this.getParent();
        if (parent) {
            switch (type) {
                case POSITION.TOP:
                    return parent.getY() - position55;
                case POSITION.BOTTOM:
                    return parent.getY() + position45;
                default:
                    return parent.getY() + 0;
            }
        }
    };
}

//-------------------------------------------end -------------------------/

turnShape = (shape) => {

    let y = shape.getY();
    let x = shape.getX();
    let w = shape.getWidth();
    let h = shape.getHeight();

    let height = shape.getWidth();
    shape.setWidth(shape.getHeight());
    shape.setHeight(height);

    if (w > h) {
        shape.setX(x + (w / 2 / scale) - (h / 2 / scale));
        shape.setY(y - (w / 2 / scale));

    } else {
        shape.setX(x - (h / 2 / scale) - (w / 2 / scale));
        shape.setY(y + (h / 2 / scale));
    }

    let arrow = getShapeById(shape.arrowsId[0]);
    if (arrow) {
        if (arrow.type === POSITION.TOP) {
            arrow.type = POSITION.RIGHT
        } else if (arrow.type === POSITION.BOTTOM) {
            arrow.type = POSITION.LEFT
        } else if (arrow.type === POSITION.LEFT) {
            arrow.type = POSITION.TOP
        } else {
            arrow.type = POSITION.BOTTOM
        }
    }
};

function reOffset() {
    var BB = canvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;
}

var offsetX, offsetY;


// drag related vars
var isDragging = false;
var startX, startY;

// hold the index of the shape being dragged (if any)
var selectedShapeId;

// draw the shapes on the canvas


//клик правой клавишей
function rightClick() {
    console.info("клик правой кнопкой")
};

//клик роликом
function rolClick() {
    canvas.style.cursor = "move";
    console.info("клик роликом");
    allDraging = true;
};

// given mouse X & Y (mx & my) and shape object
// return true/false whether mouse is inside the shape
function isMouseInShape(mx, my, shape) {
    // if (shape.radius) {
    //     // this is a circle
    //     var dx = mx - shape.getX();
    //     var dy = my - shape.getY();
    //     // math test to see if mouse is inside circle
    //     if (dx * dx + dy * dy < shape.radius * shape.radius) {
    //         // yes, mouse is inside this circle
    //         return (true);
    //     }
    // }

    // this is a rectangle
    var rLeft = shape.getX() - 10;
    var rRight = shape.getX() + shape.getWidth() / scale + 20;
    var rTop = shape.getY() - 10;
    var rBott = shape.getY() + shape.getHeight() / scale + 20;
    // math test to see if mouse is inside rectangle
    if (shape.name === 'Light') {
        console.info(my, shape.getY(), rBott, shape.getHeight());

    }
    if (mx > rLeft && mx < rRight && my > rTop && my < rBott) {
        return (true);
    }

    // the mouse isn't in any of the shapes
    return (false);
}

function isMouseInShapeAccurency100(mx, my, shape) {
    var rLeft = shape.getX();
    var rRight = shape.getX() + shape.getWidth() / (isSerialized(shape) ? scale : 1);
    var rTop = shape.getY();
    var rBott = shape.getY() + shape.getHeight() / (isSerialized(shape) ? scale : 1);

    if (mx > rLeft && mx < rRight && my > rTop && my < rBott) {
        return true;
    }

    return false;
}


function needHideControlButton(mx, my, shape) {
    if (shape.getWidth()) {
        var rLeft = shape.getX() - 50;
        var rRight = shape.getX() + shape.getWidth() / scale + 50;
        var rTop = shape.getY() - 50;
        var rBott = shape.getY() + shape.getHeight() / scale + 50;
        // math test to see if mouse is inside rectangle
        if (mx > rLeft && mx < rRight && my > rTop && my < rBott) {
            return (false);
        }
    }
    // the mouse isn't in any of the shapes
    return (true);
}

function handleMouseDown(e) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    if (e.which === 3) {
        rightClick(e);
        return;
    } else if (e.which === 2) {
        rolClick(e);
        return;
    }

    for (var i = 0; i < shapes.length; i++) {
        if (shapes[i] instanceof ChangeSizeElement && !shapes[i].notDragable && isMouseInShape(startX, startY, shapes[i])) {
            shapes[i].onClick && shapes[i].onClick();
            if (shapes[i]) {
                selectedShapeId = shapes[i].getId();
                isDragging = true;
                return;
            }
        }
    }
    for (var i = 0; i < shapes.length; i++) {
        if (!shapes[i].notDragable && isMouseInShapeAccurency100(startX, startY, shapes[i])) {
            shapes[i].onClick && shapes[i].onClick();
            if (shapes[i]) {
                selectedShapeId = shapes[i].getId();
                isDragging = true;
                shapes.filter(item => !item.relatedShapes || item.relatedShapes.indexOf(selectedShapeId) === -1).forEach(confirmShapes);
                shapes[i].fixed = false;
            }
            return;
        }
    }
}

function handleMouseUp(e) {
    allDraging = false;
    canvas.style.cursor = "default";
    // return if we're not dragging
    if (!isDragging) {
        return;
    }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging = false;

    drawAll();
    serialize();
}

function handleMouseOut(e) {
    // return if we're not dragging
    if (!isDragging) {
        return;
    }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging = false;
}

function handleMouseMove(e) {
    //текущие координаты мыши
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    let has = false;// мышка находится на элементе с подсказкой
    for (var i = 0; i < shapes.length; i++) {
        if (!isDragging && isMouseInShape(mouseX, mouseY, shapes[i])) {//todo точное положение
            //если курсор находится над фигурой, необходимо отрисовать кнопки
            shapes[i].fixed = false;
        } else {
            //если курсор отвели от фигуры спрятать кнопки управления
            !isDragging && needHideControlButton(mouseX, mouseY, shapes[i]) && shapes[i].confirm && shapes[i].confirm();
        }
        //проверка и отрисовка подсказок
        if (isMouseInShapeAccurency100(mouseX, mouseY, shapes[i]) && shapes[i].hint) {
            has = true;
            drawAll();
            canvas.style.cursor = "pointer";
            shapes[i] && drawHint(ctx, mouseX, mouseY, shapes[i].hint)
        }
    }
    if (!has) {
        //скрываем подсказки
        canvas.style.cursor = "default";
        drawAll();
    }

    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position

    // how far has the mouse dragged from its previous mousemove position?
    var dx = mouseX - startX;
    var dy = mouseY - startY;

    if (allDraging) {
        karkas.setX(karkas.getX() + dx);
        karkas.setY(karkas.getY() + dy);
        drawAll();
        startX = mouseX;
        startY = mouseY;
        return;
    }

    if (!isDragging) {
        return;
    }

    // move the selected shape by the drag distance
    var selectedShape = getSelectedShape();
    let magnetShapeXValue = magnetShapeX(selectedShape);

    if (selectedShape instanceof ChangeSizeElement) {
        selectedShape.resizeShape((magnetShapeXValue ? magnetShapeXValue : dx), dy)
    } else {
        selectedShape.setX(selectedShape.getX() + (magnetShapeXValue ? magnetShapeXValue : dx));
        selectedShape.setY(selectedShape.getY() + dy);
    }
    // clear the canvas and redraw all shapes
    drawAll();

    // update the starting drag position (== the current mouse position)
    if (!magnetShapeXValue) {
        startX = mouseX;
    }
    startY = mouseY;
}


function magnetShapeX(shape) {
    let accuracyWithScale = getScaleValue(accuracy);
    let result = 0;
    shapes.filter(item => item.getId() !== shape.getId())
        .filter(item => !(item instanceof RelatedShape))
        .filter(item => !(item instanceof Arrow))
        .filter(item => shape.getId() !== item.parentId)
        .filter(item => item.getId() !== karkas.getId())
        .forEach(item => {
            if (shape instanceof RelatedShape) {
                shape = shape.getParent()
            }
            var sLeft = shape.getX();
            var sRight = shape.getX() + shape.getWidth() / scale;
            var sTop = shape.getY();
            var sBott = shape.getY() + shape.getHeight() / scale;

            var iLeft = item.getX();
            var iRight = item.getX() + item.getWidth() / scale;
            var iTop = item.getY();
            var iBott = item.getY() + item.getHeight() / scale;
            // math test to see if mouse is inside rectangle
            if (sRight + accuracyWithScale > iLeft && sRight < iLeft + accuracyWithScale) {
                result = iLeft - sRight;
            } else if (sRight + accuracyWithScale > iRight && sRight < iRight + accuracyWithScale) {
                result = iRight - sRight;
            }
        });

    return Number(round(result, 5));
}

//функция обработки ролика мышки
var mouse_wheel = function (event) {
    //запрещаем прокручивать страницу при изменении масштаба
    event.preventDefault();

    if (false == !!event) event = window.event;
    var direction = ((event.wheelDelta) ? event.wheelDelta / 120 : event.detail / -3) || false;
    if (direction && !!wheel_handle && typeof wheel_handle == "function") {
        wheel_handle(direction);
    }
};

var set_handle = function (canvas, func) {
    canvas.onmouseover = function () {
        wheel_handle = func;
    };
    canvas.onmouseout = function () {
        wheel_handle = null;
    }
};

function handleMouseWheelUp(v) {
    scale += v > 0 ? .3 : -0.3;
    if (scale < 2) scale = 2;
    confirmAllShapes();
    drawAll()
}

function confirmAllShapes() {
    shapes.forEach(confirmShapes);
}

function confirmShapes(shape) {
    shape.confirm && shape.confirm()
}

function getScaleValue(value) {
    let calcValue = value * defScaleValue / scale;
    return (calcValue > value) ? value : calcValue;
}

// clear the canvas and
// redraw all shapes in their current positions
function drawAll() {

    ctx.clearRect(0, 0, cw, ch);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, cw, ch);
    ctx.fillStyle = colorWhite;
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    if (allDraging || (isDragging && getSelectedShape() instanceof ChangeSizeElement)) {
        canvas.style.cursor = "move";
    } else {
        canvas.style.cursor = "default";
    }

    let length = shapes.length;
    shapes = shapes.filter(item => !item.deleted);
    !view3D && shapes.forEach(shapeDraw);

    if (!view3D && shapes.length !== length) {
        ctx.clearRect(0, 0, cw, ch);
        shapes.forEach(shapeDraw);
    }

    if (view3D) {
        drawDimetry();
    }
    kalkulatePrice();
}

function setDeleteAllShapeInArrId(arr) {
    arr && arr.forEach(setDeleteByShapeId);
}

function setDeleteByShapeId(id) {
    getShapeById(id).deleted = true;
}

function shapeDraw(shape) {
    shape && shape.draw && shape.draw(ctx)
}

function drawKarkasInner({name, x1, x2, x3, x4, y1, y2, y3, y4, h1, h2, color}) {
    ctx.drawImage(vagonka, x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h2 - 130 * defScaleValue / scale, 710 * defScaleValue / scale, 472 * defScaleValue / scale)
}

function drawKarkasLeft({name, x1, x2, x3, x4, y1, y2, y3, y4, h1, h2, color}) {
    ctx.drawImage(karkas_left,
        x1 * cos7 + sin41 * y1,
        y1 * cos41 - sin7 * x1 - h2 - 30 * defScaleValue / scale,
        194 * defScaleValue / scale,
        523 * defScaleValue / scale);
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.moveTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
    ctx.lineTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h2);
    ctx.lineTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h2);
    ctx.lineTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h1);
    ctx.lineTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawKarkasRight({name, x1, x2, x3, x4, y1, y2, y3, y4, h1, h2, color}) {
    ctx.save();
    ctx.beginPath();

    if (karkas.height > 2400) {
        ctx.drawImage(karkas_right, x2 * cos7 + sin41 * y2, y2 * cos41 - sin7 * x2 - h2 - 3 * defScaleValue / scale, 390 * defScaleValue / scale, 705 * defScaleValue / scale);
    } else {
        ctx.drawImage(karkas_right1, x2 * cos7 + sin41 * y2 - 199 * defScaleValue / scale, y2 * cos41 - sin7 * x2 - h2 - 130 * defScaleValue / scale, 390 * defScaleValue / scale, 705 * defScaleValue / scale);
    }

    ctx.closePath();
    ctx.restore();
}

function drawKarkasBottom({name, x1, x2, x3, x4, y1, y2, y3, y4, h1, h2, color}) {
    ctx.drawImage(pol, x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1 - 106 * defScaleValue / scale, 915 * defScaleValue / scale, 375 * defScaleValue / scale);
}

function drawKarkasFront({name, x1, x2, x3, x4, y1, y2, y3, y4, h1, h2, color}) {
    ctx.drawImage(fon, x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h2 - 130 * defScaleValue / scale, 710 * defScaleValue / scale, 720 * defScaleValue / scale);
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.moveTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h1);
    ctx.lineTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h2);
    ctx.lineTo(x3 * cos7 + sin41 * y3, y3 * cos41 - sin7 * x3 - h2);
    ctx.lineTo(x3 * cos7 + sin41 * y3, y3 * cos41 - sin7 * x3 - h1);
    ctx.lineTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h1);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawFrontWindow({name, x1, x2, x3, x4, y1, y2, y3, y4, h1, h2, color}) {
    ctx.drawImage(windowImg, x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h2 - 20 * defScaleValue / scale, 180 * defScaleValue / scale, 150 * defScaleValue / scale)
}

function draw3dRectangle({name, x1, x2, x3, x4, y1, y2, y3, y4, w, h, h1, h2, color, gorizontal}) {

    //правая плоскость
    if (name !== 'InnerDoor') {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0,0,0)';
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
    // //задняя плоскость
    // ctx.save();
    // ctx.beginPath();
    // ctx.strokeStyle = 'rgb(0,0,0)';
    // ctx.fillStyle = color;
    // ctx.moveTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
    // ctx.lineTo(x2 * cos7 + sin41 * y2, y2 * cos41 - sin7 * x2 - h1);
    // ctx.lineTo(x2 * cos7 + sin41 * y2, y2 * cos41 - sin7 * x2 - h2);
    // ctx.lineTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h2);
    // ctx.lineTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
    // ctx.stroke();
    // ctx.fill();
    // ctx.closePath();
    // ctx.restore();

    //нижняя плоскость
    // ctx.save();
    // ctx.beginPath();
    // ctx.strokeStyle = 'rgb(0,0,0)';
    // ctx.fillStyle = color;
    // ctx.moveTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
    // ctx.lineTo(x2 * cos7 + sin41 * y2, y2 * cos41 - sin7 * x2 - h1);
    // ctx.lineTo(x3 * cos7 + sin41 * y3, y3 * cos41 - sin7 * x3 - h1);
    // ctx.lineTo(x4 * cos7 + sin41 * y4, y4 * cos41 - sin7 * x4 - h1);
    // ctx.lineTo(x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h1);
    // ctx.stroke();
    // ctx.fill();
    // ctx.closePath();
    // ctx.restore();

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
        if (name === 'Partition') {
            if (h < w) {
                let coef = w / karkas.getWidth();
                ctx.drawImage(vagonka,
                    0, 0,
                    0.21 * w,
                    800,
                    x4 * cos7 + sin41 * y4,
                    y4 * cos41 - sin7 * x4 - h2 - 130 * defScaleValue / scale,
                    709 * defScaleValue / scale * coef,
                    470 * defScaleValue / scale);
                ctx.stroke();
            } else {
                ctx.stroke();
                ctx.fill();
            }
        } else if (name === 'InnerDoor') {
            ctx.fill();
            ctx.stroke();
        } else {
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
        if (name === 'Partition' && h > w) {
            let coef = h / 4800;
            ctx.drawImage(karkas_right,
                0, 0,
                0.21 * h,
                999,
                x1 * cos7 + sin41 * y1, y1 * cos41 - sin7 * x1 - h2 - 3 * defScaleValue / scale,
                390 * defScaleValue / scale * coef,
                600 * defScaleValue / scale);

        }
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

}

function drawDimetry() {

    let karkasData = shapes.filter(isSerialized).filter(item => item.name === 'Karkas').map(parseDataTo3DCreate);

    karkasData.forEach(item => {
        drawKarkasRight(item);
        drawKarkasInner(item);
        drawKarkasBottom(item);
        draw3dRectangle(item);
    });

    shapes.filter(isSerialized).filter(filterNotFrontDoor).map(parseDataTo3DCreate).forEach(draw3dRectangle);
    shapes.filter(isSerialized).filter(filterNotInner).map(parseDataTo3DCreate).forEach(draw3dRectangle);
    karkasData.forEach(item => {
        drawKarkasLeft(item);
        drawKarkasFront(item);
    });
    shapes.filter(isSerialized).filter(filterFrontDoor).map(parseDataTo3DCreate).forEach(draw3dRectangle);
    shapes.filter(isSerialized).filter(filterWindow).map(parseDataTo3DCreate).forEach(drawFrontWindow);
}

function filterFrontDoor(item) {
    return item.name === 'Door' && (item.position === POSITION.BOTTOM || item.position === POSITION.LEFT)
}

function filterBottomDoor(item) {
    return item.name === 'Door' && (item.position === POSITION.BOTTOM)
}

function filterBottomWindow(item) {
    return item.name === 'Window' && (item.position === POSITION.BOTTOM)
}

function filterNotFrontDoor(item) {
    return item.name === 'Door' && (item.position === POSITION.TOP || item.position === POSITION.RIGHT)
}

function filterNotInner(item) {
    return item.name !== 'Arrow' && item.name !== 'Karkas'
        && !(item.name === 'Door') && item.name !== 'Light'
        && !filterWindow(item)
}

function filterWindow(item) {
    return item.name === 'Window' && (item.position === POSITION.BOTTOM || item.position === POSITION.LEFT)
}

function parseDataTo3DCreate(shape) {
    return {
        name: shape.name,
        x1: shape.getX3D() - 450,
        y1: shape.getY3D() + 400,
        x2: shape.getX3D() - 450 + shape.getWidth() / scale,
        y2: shape.getY3D() + 400,
        x3: shape.getX3D() - 450 + shape.getWidth() / scale,
        y3: shape.getY3D() + 400 + shape.getHeight() * y3dcefficient / scale,
        x4: shape.getX3D() - 450,
        y4: shape.getY3D() + 400 + shape.getHeight() * y3dcefficient / scale,
        w: shape.getWidth(),
        h: shape.getHeight(),
        h1: (shape.name == "Window" ? 1000 : 0) / scale,
        h2: (shape.name == "Window" || shape.name == 'Door' || shape.name == 'InnerDoor' ? 2000 : 2500) / scale,
        color: (shape.name == "Window") ?
            'rgb(0,12,255)' :
            (shape.name == 'Door' || shape.name == 'InnerDoor') ?
                'rgb(178,88,0)' :
                (shape.name == 'Partition') ?
                    'rgb(205,128,0)' : 'rgba(0, 0, 0, 0)',
        gorizontal: (shape.getWidth() > shape.getHeight())

    }
}

function kalkulatePrice() {
    let priceValue = [];
    let root = document.getElementById(rootDivId);
    removeElement('price-block');
    let priceDiv = createHtmlElement(HTML_ELEMENT.DIV, {id: 'price-block'});
    root.appendChild(priceDiv);
    priceDiv.appendChild(createHtmlElement(HTML_ELEMENT.H4, {text: 'Цена изделия', style: TEXT_ALIGN_CENTER}));
    let withPrice = shapes.filter(isSerialized).filter(item => !!item.price);
    if (withPrice.length > 0) {
        let table = createHtmlElement(HTML_ELEMENT.TABLE, {});
        priceDiv.appendChild(table);
        let thead = createHtmlElement(HTML_ELEMENT.THEAD, {});
        table.appendChild(thead);
        let name = createHtmlElement(HTML_ELEMENT.TH, {text: 'Наименование'});
        let thPrice = createHtmlElement(HTML_ELEMENT.TH, {text: 'Цена, руб'});
        thead.appendChild(name);
        thead.appendChild(thPrice);
        let tBody = createHtmlElement(HTML_ELEMENT.TBODY, {});
        table.appendChild(tBody);
        let total = 0;
        withPrice.forEach(item => {
            let tr = createHtmlElement(HTML_ELEMENT.TR, {});
            tr.appendChild(createHtmlElement(HTML_ELEMENT.TD, {text: getNameToPriceTable(item)}));
            tr.appendChild(createHtmlElement(HTML_ELEMENT.TD, {text: round(item.price, 2)}));
            tBody.appendChild(tr);
            total += Number(round(Number(item.price), 2));
        });
        let tr = createHtmlElement(HTML_ELEMENT.TR, {});
        tr.appendChild(createHtmlElement(HTML_ELEMENT.TD, {
            text: 'Итого:',
            style: 'border: 1px solid #fff;text-align: right'
        }));
        tr.appendChild(createHtmlElement(HTML_ELEMENT.TD, {
            text: round(total, 2) + 'руб.',
            style: 'font-weight: bold;'
        }));
        tBody.appendChild(tr);
    }
}

function getNameToPriceTable(item) {
    if (item.name === 'Karkas') {
        return `Базовая комплектация бытовки ${item.width}х${item.height}мм`
    } else if (item.name === 'Door') {
        return item.printName || `Дверь входная (правая/левая), ${item.getWidth()}мм`
    } else if (item.name === 'InnerDoor') {
        return item.printName || `Дверь межкомнатная (правая/левая), ${item.getWidth()}мм`
    } else if (item.name === 'Window') {
        return `Окно поворотно-откидное, ${item.getWidth()}х1100мм`
    } else if (item.name === 'Partition') {
        let width = (item.getWidth() > item.getHeight()) ? round(item.getWidth()) : round(item.getHeight());
        return `Перегородка межкомнатная ${width}мм`
    } else {
        return item.nameRu
    }
}

function clearControlButton(shape) {
    return {...shape, relatedShapes: [], fixed: true}
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function drawHint(ctx, x, y, text = 'Подсказка') {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y - 30, 10 + text.length * 11, 20);
    ctx.strokeStyle = "rgba(0,0,0,0.41)";
    ctx.fillStyle = colorWhite;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.86)";
    ctx.font = "italic 12pt Arial";
    ctx.fillText(text, x + 15, y - 13);
    ctx.restore();
    ctx.closePath();
}

function getSelectedShape() {
    return shapes.filter(item => item.getId() === selectedShapeId)[0];
}

function createFromTemplate(data) {
    let newShape = [];
    let arr = JSON.parse(data);
    arr.forEach(item => {
        let obj = item;
        switch (obj.name) {
            case 'Karkas':
                let karkas1 = Karkas.from(obj);
                karkas1.id = obj.id;
                karkas = karkas1;
                karkas.setX(100);
                karkas.setY(70);
                newShape.push(karkas1);
                break;
            case 'Door':
                let assign = Object.assign(new Door(), obj);
                assign.id = obj.id;
                newShape.push(assign);
                break;
            case 'Window':
                let assign1 = Object.assign(new Window(), obj);
                assign1.id = obj.id;
                newShape.push(assign1);
                break;
            case 'Partition':
                let assign2 = Object.assign(new Partition(), obj);
                assign2.id = obj.id;
                newShape.push(assign2);
                break;
            case 'Arrow':
                let assign3 = Object.assign(new Arrow(), obj);
                assign3.id = obj.id;
                newShape.push(assign3);
                break;
            case 'InnerDoor':
                let assign4 = Object.assign(new InnerDoor(), obj);
                assign4.id = obj.id;
                newShape.push(assign4);
                break;
            case 'Light':
                let assign5 = Object.assign(new Light(), obj);
                assign5.id = obj.id;
                newShape.push(assign5);
                break;
        }
    });
    shapesMap = new Map();
    newShape.forEach(item => {
        shapesMap.set(item.getId(), item);
    });
    shapes = newShape;
    drawAll();
}

function getShapeById(id) {
    return shapesMap.get(id);
}

//-------------------------------------------------------------------------//
//--------- Серилизация и дэсерелизация из sessionStorage  ---------------//

function isSerialized(shape) {
    let notSerialised = ['DragElement', 'ChangeSizeElement', 'ChangeOpenTypeButton', 'AddInnerDoorButton', 'MirrorButton', 'DeleteButton', 'ConfirmButton', 'TurnButton'];
    return notSerialised.indexOf(shape.name) === -1
}

function setToSession(item) {
    sessionStorage.setItem('shapes', JSON.stringify(item))
}

function deserialize() {
    let i = 0;
    let newShape = [];
    if (sessionStorage.getItem('shapes') !== 'undefined' && sessionStorage.getItem('shapes') !== null) {
        let arr = JSON.parse(sessionStorage.getItem('shapes'));
        arr.forEach(obj => {
            switch (obj.name) {
                case 'Karkas':
                    let karkas1 = Karkas.from(obj);
                    karkas1.id = obj.id;
                    karkas = karkas1;
                    karkas.setX(100);
                    karkas.setY(70);
                    newShape.push(karkas1);
                    break;
                case 'Door':
                    let assign = Object.assign(new Door(), obj);
                    assign.id = obj.id;
                    newShape.push(assign);
                    break;
                case 'Window':
                    let assign1 = Object.assign(new Window(), obj);
                    assign1.id = obj.id;
                    newShape.push(assign1);
                    break;
                case 'Partition':
                    let assign2 = Object.assign(new Partition(), obj);
                    assign2.id = obj.id;
                    newShape.push(assign2);
                    break;
                case 'Arrow':
                    let assign3 = Object.assign(new Arrow(), obj);
                    assign3.id = obj.id;
                    newShape.push(assign3);
                    break;
                case 'InnerDoor':
                    let assign4 = Object.assign(new InnerDoor(), obj);
                    assign4.id = obj.id;
                    newShape.push(assign4);
                    break;
                case 'Light':
                    let assign5 = Object.assign(new Light(), obj);
                    assign5.id = obj.id;
                    newShape.push(assign5);
                    break;
            }
        })
    }
    shapesMap = new Map();
    newShape.forEach(item => {
        shapesMap.set(item.getId(), item);
    });
    shapes = newShape;
    drawAll();
}

function serialize() {
    sessionStorage.clear();
    setToSession(shapes.filter(isSerialized).map(clearControlButton));
}

//-------------------------------------------------------------------------//
//---------------------- Рисование простых фигур --------------------------//

function drawChangeOpen(ctx, x, y, width, height) {
    let scaleValue1 = getScaleValue(1);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + (height / 2) - scaleValue1);
    ctx.lineTo(x + width, y + (height / 2) - scaleValue1);
    ctx.lineTo(x, y);
    ctx.moveTo(x, y + (height / 2) + scaleValue1);
    ctx.lineTo(x + width, y + (height / 2) + scaleValue1);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + (height / 2) + scaleValue1);
}

function drawMirror(ctx, x, y, width, height) {
    let scaleValue1 = getScaleValue(1);
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + (width / 2) - scaleValue1, y);
    ctx.lineTo(x + (width / 2) - scaleValue1, y + height);
    ctx.lineTo(x, y + height);
    ctx.moveTo(x + width, y + height);
    ctx.lineTo(x + (width / 2) + scaleValue1, y);
    ctx.lineTo(x + (width / 2) + scaleValue1, y + height);
    ctx.lineTo(x + width, y + height);
}

/**
 * Отрисовка стрелки указывающей вниз
 * @param ctx конткст для рисования
 * @param x координата x точки на которую указывает стрелка
 * @param y координата y точки на которую указывает стрелка
 * @param width ширина стрелки
 * @param height высота стрелки
 */
function drawBottomArrow(ctx, x, y, width = 10, height = 20) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y - height);
    ctx.lineTo(x - width / 2, y - height);
    ctx.lineTo(x, y);
}

/**
 * Отрисовка стрелки указывающей вправо
 * @param ctx конткст для рисования
 * @param x координата x точки на которую указывает стрелка
 * @param y координата y точки на которую указывает стрелка
 * @param width ширина стрелки
 * @param height высота стрелки
 */
function drawRightArrow(ctx, x, y, width = 20, height = 10) {
    ctx.moveTo(x, y);
    ctx.lineTo(x - width, y + height / 2);
    ctx.lineTo(x - width, y - height / 2);
    ctx.lineTo(x, y);
}

/**
 * Отрисовка стрелки указывающей влево
 * @param ctx конткст для рисования
 * @param x координата x точки на которую указывает стрелка
 * @param y координата y точки на которую указывает стрелка
 * @param width ширина стрелки
 * @param height высота стрелки
 */
function drawLeftArrow(ctx, x, y, width = 20, height = 10) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y + height / 2);
    ctx.lineTo(x + width, y - height / 2);
    ctx.lineTo(x, y);
}

/**
 * Отрисовка стрелки указывающей вверх
 * @param ctx конткст для рисования
 * @param x координата x точки на которую указывает стрелка
 * @param y координата y точки на которую указывает стрелка
 * @param width ширина стрелки
 * @param height высота стрелки
 */
function drawTopArrow(ctx, x, y, width = 10, height = 20) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y + height);
    ctx.lineTo(x - width / 2, y + height);
    ctx.lineTo(x, y);
}

/**
 * Отрисовка крестика
 * @param ctx
 * @param x
 * @param y
 * @param width
 * @param height
 */
function drawCross(ctx, x, y, width, height) {
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width / 2, y + height);
    ctx.moveTo(x, y + height / 2);
    ctx.lineTo(x + width, y + height / 2);
}

/**
 * Отрисовка горизонтальной двери
 * @param ctx контекст для рисования
 * @param x координата x левой верхней точки
 * @param y координата y левой верхней точки
 * @param width длина
 * @param height ширина
 * @param openingType тип открытия, внутрь, в наружу
 * @param direction левая или правая дверь
 */
function drawGorizontalDoor(ctx, x, y, width, height, openingType, direction = DIRECTION.RIGHT, isPartition = false) {

    let fonColor = colorWhite;
    let baseColor = colorBlack;
    let borderColor = "rgb(0,0,255)";

    //белая область
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y - 1, width, height + 2);
    ctx.strokeStyle = fonColor;
    ctx.fillStyle = fonColor;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    //дверь
    ctx.beginPath();
    ctx.strokeStyle = colorBlack;
    switch (direction) {
        case "RIGHT":
            switch (openingType) {
                case OPENING_TYPE.OUT:
                    ctx.arc(x + width, y - (isPartition ? 430 : 420) / scale, 935 / scale, Math.PI * 2.5, Math.PI * 2.828, false);
                    ctx.moveTo(x + width, y);
                    ctx.lineTo(x + width, y + 510 / scale);
                    break;
                case OPENING_TYPE.IN:
                    ctx.arc(x + width, y + 400 / scale, 900 / scale, Math.PI * 3.145, Math.PI * 1.5, false);
                    ctx.moveTo(x + width, y);
                    ctx.lineTo(x + width, y - 505 / scale);
                    break;
            }
            break;
        case "LEFT":
            switch (openingType) {
                case OPENING_TYPE.OUT:
                    ctx.arc(x, y - 400 / scale, 905 / scale, Math.PI * 2.155, Math.PI * 2.5, false);
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + 505 / scale);
                    break;
                case OPENING_TYPE.IN:
                    ctx.arc(x, y + 400 / scale, 900 / scale, Math.PI * 1.5, Math.PI * 1.855, false);
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y - 505 / scale);
                    break;
            }
            break;


    }
    ctx.strokeStyle = baseColor;
    ctx.stroke();
    ctx.closePath();

    //синие боковушки стены

    let depth = isPartition ? defPartitionHeight / scale : karkasDepth * defScaleValue / scale

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + depth);
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width, y + depth);
    ctx.strokeStyle = borderColor;
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
}

/**
 * Отрисовка вертикальной двери
 * @param ctx контекст для рисования
 * @param x координата x левой верхней точки
 * @param y координата y левой верхней точки
 * @param width длина
 * @param height ширина
 * @param openingType тип открытия, внутрь, в наружу
 * @param direction левая или правая дверь
 */
function drawVertikalDoor(ctx, x, y, width, height, openingType, direction = DIRECTION.RIGHT) {

    let fonColor = colorWhite;
    let baseColor = colorBlack;
    let borderColor = "rgb(0,0,255)";

    //белая область
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - 1, y, width + 2, height);
    ctx.strokeStyle = fonColor;
    ctx.fillStyle = fonColor;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    //дверь
    ctx.beginPath();
    ctx.strokeStyle = colorBlack;
    switch (direction) {

        case DIRECTION.RIGHT:
            switch (openingType) {
                case OPENING_TYPE.OUT:
                    ctx.arc(x + width - 400 / scale, y, 900 / scale, Math.PI * 2.0, Math.PI * 2.355, false);
                    ctx.moveTo(x + width, y);
                    ctx.lineTo(x + width + 505 / scale, y);
                    break;
                case OPENING_TYPE.IN:
                    ctx.arc(x + 400 / scale, y, 900 / scale, Math.PI * 0.65, Math.PI, false);
                    ctx.moveTo(x, y);
                    ctx.lineTo(x - 505 / scale, y);
                    break;
            }
            break;
        case DIRECTION.LEFT:
            switch (openingType) {
                case OPENING_TYPE.OUT:
                    ctx.arc(x + width - 400 / scale, y + height, 900 / scale, Math.PI * 1.645, Math.PI * 2, false);
                    ctx.moveTo(x + width, y + height);
                    ctx.lineTo(x + width + 505 / scale, y + height);

                    break;
                case OPENING_TYPE.IN:
                    ctx.arc(x + 400 / scale, y + height, 900 / scale, Math.PI, Math.PI * 1.355, false);
                    ctx.moveTo(x, y + height);
                    ctx.lineTo(x - 505 / scale, y + height);
                    break;
            }
            break;


    }
    ctx.strokeStyle = baseColor;
    ctx.stroke();
    ctx.closePath();

    //синие боковушки стены
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + karkasDepth, y);
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + karkasDepth, y + height);
    ctx.strokeStyle = borderColor;
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
}

function drawAddDoor(ctx, x, y, width, height) {

    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + width - getScaleValue(3), y + height);
    ctx.lineTo(x + width - getScaleValue(3), y);
    ctx.lineTo(x, y);
    ctx.lineTo(x + width - getScaleValue(4), y - getScaleValue(3));
    ctx.lineTo(x + width - getScaleValue(5), y);
    ctx.moveTo(x + width - getScaleValue(7), y + height / 2);
    ctx.lineTo(x + width - getScaleValue(5), y + height / 2);

}

function drawWhiteRectangle(x, y, w, h) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - 2, y - 2, w + 4, h + 4);
    ctx.strokeStyle = colorWhite;
    ctx.fillStyle = colorWhite;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();

}

function round(number, digit = 0) {
    if (number) {
        return Number(number).toFixed(digit);
    }
    return 0;
}

const templates = [
    {
        name: 'СБ1-6',
        img: 'https://xn--90acsfcjpnu1gc.xn--p1ai/wp-content/uploads/2020/02/sb1-7ch1.png',
        data: '[{"id":"04fb0573-bc29-4cbd-9f08-d297851b9e74","x":100,"y":70,"width":6000,"height":2400,"color":"rgb(0,0,255)","notDragable":true,"fixed":true,"name":"Karkas","arrowsId":["297d6d4e-d71f-4606-b76d-030dbfa598a8","addd1d78-c2c7-43cf-b986-a47877fedef9"],"relatedShapes":[],"price":80000,"nameRu":"Каркас"},{"id":"297d6d4e-d71f-4606-b76d-030dbfa598a8","x":100,"y":20,"width":6000,"color":"rgba(0,0,0,0.41)","text":"6000 мм","notDragable":true,"fixed":true,"name":"Arrow","parentId":"04fb0573-bc29-4cbd-9f08-d297851b9e74","arrowsId":[],"type":"TOP","relatedShapes":[]},{"id":"addd1d78-c2c7-43cf-b986-a47877fedef9","x":100,"y":120,"width":2400,"color":"rgba(0,0,0,0.41)","text":"2400 мм","notDragable":true,"fixed":true,"name":"Arrow","parentId":"04fb0573-bc29-4cbd-9f08-d297851b9e74","arrowsId":[],"type":"LEFT","relatedShapes":[]},{"id":"fda3c3dd-88b6-4712-ba3b-d5af5b3cbbb5","x":409.5238095238095,"y":347.3809523809524,"width":800,"height":8.333333333333332,"color":"rgba(0, 0, 0)","notDragable":false,"fixed":true,"name":"Door","parentId":"04fb0573-bc29-4cbd-9f08-d297851b9e74","arrowsId":["eddf9701-dd72-43c9-aaf0-474eaa76ad85"],"relatedShapes":[],"shift":43.52999973333346,"position":"BOTTOM","direction":"RIGHT","opening":"OUT","nameRu":"дверь","price":5000},{"id":"eddf9701-dd72-43c9-aaf0-474eaa76ad85","x":409.5238095238095,"y":297.3809523809524,"width":800,"color":"rgba(0,0,0,0.41)","notDragable":true,"fixed":true,"name":"Arrow","parentId":"fda3c3dd-88b6-4712-ba3b-d5af5b3cbbb5","arrowsId":[],"type":"TOP","relatedShapes":[]},{"id":"4d364167-19ba-4e16-ad5c-bad41a63756c","x":338.0952380952381,"y":212.85714285714286,"width":50,"height":2252.000000000001,"color":"rgb(0,0,255)","notDragable":false,"fixed":true,"name":"Partition","parentId":"04fb0573-bc29-4cbd-9f08-d297851b9e74","arrowsId":[],"relatedShapes":[],"doorId":"d0f7fda3-95d0-4421-9fa0-00367e3ad6dc","price":11260,"positionTop":2.916666666666666,"positionRight":36.889999533333345,"nameRu":"перегородку"},{"id":"5c437363-9193-48be-8539-c9821ceaa6b5","x":338.0952380952381,"y":212.85714285714286,"width":50,"height":2260.4000000000015,"color":"rgb(0,0,255)","notDragable":false,"fixed":true,"name":"Partition","parentId":"04fb0573-bc29-4cbd-9f08-d297851b9e74","arrowsId":[],"relatedShapes":[],"doorId":"2060ca14-8825-4392-a813-cb43b0fb47c7","price":11302,"positionTop":2.900000000000017,"positionRight":62.88333333333338,"nameRu":"перегородку"},{"id":"d0f7fda3-95d0-4421-9fa0-00367e3ad6dc","x":291.96428571428567,"y":472.6190476190477,"width":800,"height":50,"color":"rgba(0, 0, 0)","notDragable":false,"fixed":true,"name":"InnerDoor","parentId":"4d364167-19ba-4e16-ad5c-bad41a63756c","arrowsId":[],"relatedShapes":[],"shift":50,"direction":"LEFT","opening":"IN","position":"RIGHT","nameRu":"дверь"},{"id":"2060ca14-8825-4392-a813-cb43b0fb47c7","x":291.96428571428567,"y":473.61904761904776,"width":800,"height":50,"color":"rgba(0, 0, 0)","notDragable":false,"fixed":true,"name":"InnerDoor","parentId":"5c437363-9193-48be-8539-c9821ceaa6b5","arrowsId":[],"relatedShapes":[],"shift":50,"direction":"RIGHT","opening":"OUT","position":"RIGHT","nameRu":"дверь"},{"id":"d30a4972-e670-45a4-8cab-4143807c3869","x":213.09523809523807,"y":347.3809523809524,"width":800,"height":8.333333333333332,"color":"rgba(0, 0, 0)","notDragable":false,"fixed":true,"name":"Window","parentId":"04fb0573-bc29-4cbd-9f08-d297851b9e74","arrowsId":["e7fa9af8-5b63-4404-bc63-ec4707ddf405"],"relatedShapes":[],"shift":11.07333333333333,"position":"BOTTOM","nameRu":"окно","price":5000},{"id":"e7fa9af8-5b63-4404-bc63-ec4707ddf405","x":213.09523809523807,"y":397.3809523809524,"width":800,"color":"rgba(0,0,0,0.41)","notDragable":true,"fixed":true,"name":"Arrow","parentId":"d30a4972-e670-45a4-8cab-4143807c3869","arrowsId":[],"type":"BOTTOM","relatedShapes":[]},{"id":"4c08018c-4f7f-417e-9d00-949ff0f237bd","x":213.09523809523807,"y":347.3809523809524,"width":800,"height":8.333333333333332,"color":"rgba(0, 0, 0)","notDragable":false,"fixed":true,"name":"Window","parentId":"04fb0573-bc29-4cbd-9f08-d297851b9e74","arrowsId":["a612ebb3-326b-4d7b-8a22-b612d811f5fd"],"relatedShapes":[],"shift":75.31333333333352,"position":"BOTTOM","nameRu":"окно","price":5000},{"id":"a612ebb3-326b-4d7b-8a22-b612d811f5fd","x":405.9523809523809,"y":397.3809523809524,"width":800,"color":"rgba(0,0,0,0.41)","notDragable":true,"fixed":true,"name":"Arrow","parentId":"4c08018c-4f7f-417e-9d00-949ff0f237bd","arrowsId":[],"type":"BOTTOM","relatedShapes":[]},{"id":"339bfc35-5835-4867-a5dd-1d4264ca1d3a","x":278.57142857142856,"y":212.85714285714286,"width":200,"height":200,"color":"rgba(0,0,0,0.41)","notDragable":false,"fixed":true,"name":"Light","parentId":"04fb0573-bc29-4cbd-9f08-d297851b9e74","arrowsId":[],"relatedShapes":[],"positionTop":45.699999999999974,"positionRight":16.173333200000002,"nameRu":"светильник","price":500},{"id":"8b8935bd-7c6b-49fc-9476-d39c1eac3546","x":278.57142857142856,"y":212.85714285714286,"width":200,"height":200,"color":"rgba(0,0,0,0.41)","notDragable":false,"fixed":true,"name":"Light","parentId":"04fb0573-bc29-4cbd-9f08-d297851b9e74","arrowsId":[],"relatedShapes":[],"positionTop":45.69999999999985,"positionRight":80.27333280000012,"nameRu":"светильник","price":500}]'
    }]
