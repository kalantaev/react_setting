import React from 'react';
import {
    renderCanvasInTeg,
    renderKarkas,
    renderWindow,
    drawDimetry,
    drawFrontWindow,
    drawKarkas3D, drawTextyre3D, renderCanvasToTex
} from "../canvas-element/canvas";
import {API_ROOT} from "../agent";

// import '../canvas-element/Karkas'


class ConstructorJs extends React.Component {

    state = {d3: false}
    image = new Image();
    imageTexture = new Image();
    init = false;
    initTexture = false;

    renderCanvas() {
        let data = {w: this.props.baseWidth, h: this.props.baseHeight, img: this.imageTexture, inner: this.props.inner};

        if (document.getElementById('canvas-tx') || document.getElementById('canvas-el')) {
            this.props.type !== "TEXTURE" && !this.state.d3 && renderWindow(renderKarkas(renderCanvasInTeg("canvas-el")), this.props.width);
            this.props.type === "WINDOW" && this.state.d3 && drawFrontWindow(drawDimetry(renderCanvasInTeg("canvas-el"), {
                w: 6000,
                h: 2400
            }), this.props.width, this.props.height, this.image);
            this.props.type === "KARKAS" && this.state.d3 && drawKarkas3D(drawDimetry(renderCanvasInTeg("canvas-el")), this.image);
            if (this.props.type === "TEXTURE") {
                // console.info(2, this.props.imageTexture)
                this.props.baseWidth && this.props.baseHeight &&
                this.props.imageTexture && drawDimetry(drawKarkas3D(renderCanvasInTeg("canvas-el"), data), data);

                !this.props.imageTexture && drawTextyre3D(renderCanvasToTex("canvas-tx"), this.image, this.props.updateTexture, this.props.needCreate, this.props.width);
            }
        }
    }

    componentDidMount() {
        if (this.props.imageId) {
            this.image.src = `${API_ROOT}/image/${this.props.imageId}`;
            this.image.crossOrigin = 'anonimus';
            this.init = true;
        }
        this.state = {d3: this.props.d3};
        this.renderCanvas();
        this.renderLoop();
    }

    renderLoop() {
        this.renderCanvas();
        if (document.getElementById('canvas-el')) {
            setTimeout(() => this.renderLoop(), 1000);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
       if (!this.props.imageId) {
           this.image = new Image();
           this.init = false;
       }
       if (!this.props.imageTexture) {
           this.imageTexture = new Image();
           this.initTexture = false;
       }
        if ((!this.init || this.props.imageId !== prevProps.imageId) && (this.props.imageId)) {
            this.image.src = `${API_ROOT}/image/${this.props.imageId}`;
            this.image.crossOrigin = 'anonimus';
            this.init = true;
        }
        // console.info(this.props.imageTexture, prevProps.imageTexture)
        if ((!this.initTexture || this.props.imageTexture !== prevProps.imageTexture) && (this.props.imageTexture)) {
            this.imageTexture.src = `${API_ROOT}/image/${this.props.imageTexture}`;
            this.imageTexture.crossOrigin = 'anonimus';
            this.initTexture = true;
        }
        this.renderCanvas()
    }

    set3D() {
        this.setState({d3: !this.state.d3})
    }

    render() {
        return <div>
            <canvas id={"canvas-el"} width={window.innerWidth * 0.55} height={window.innerWidth * 0.20}/>
            <canvas id={"canvas-tx"} width={3000} height={500} className={'non'}/>
            {!this.props.hideBtn && <button
                className="btn btn-lg btn-primary pull-xs-right"
                onClick={() => this.set3D()}>
                {this.state.d3 ? '2D' : '3D'}
            </button>}
        </div>
    }
}

export default ConstructorJs;
