import './Rectangle.js'

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

export default Karkas