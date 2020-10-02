import "./Shape";

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

export default Rectangle