import Karkas from "./Karkas";

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

export default Shape