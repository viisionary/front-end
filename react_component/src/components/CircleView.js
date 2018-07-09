import React from "react";
import PropTypes from "prop-types";

// 宽度
const LINE = 50;
//半径
const R = 500;
const BEGIN = 0.92;
const END = 2.08;
const outLine = 5;
const spaceLine = 70;
const W = R + spaceLine + outLine;
//画布左上间距
const margin = 27;
//画布高度
const drawHeight = margin * 2 + W + W * Math.cos(0.42 * Math.PI);
const drawWidth = (margin + W) * 2;
//画布宽度

//小圆的半径
export default class CircleView extends React.Component {
    static propTypes = {
        percent: PropTypes.number.isRequired,
        style: PropTypes.object,
    };

    componentDidMount() {
        let {percent} = this.props;
        if (percent >= 1) {
            percent = 1
        }
        const SHOW = BEGIN + (END - BEGIN) * percent;
        let Ri = (R + spaceLine);
        let ctx = this.circle.getContext("2d");
        // let left = (1500 - W * 2) / 2;
        ctx.translate(margin, margin);

        ctx.beginPath();
        ctx.lineWidth = outLine;
        ctx.lineCap = "round";
        ctx.strokeStyle = '#fff';
        ctx.shadowColor = "rgba(0,0,0,0)";
        ctx.arc(W, W, R + spaceLine, BEGIN * Math.PI, END * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = LINE;
        ctx.lineCap = "round";
        ctx.strokeStyle = 'rgba(255,255,255, 0.6)';
        ctx.shadowBlur = 3;
        //阴影
        ctx.shadowOffsetY = 3;
        ctx.arc(W, W, R, BEGIN * Math.PI, END * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = LINE;
        ctx.lineCap = "round";
        ctx.strokeStyle = '#fff';
        ctx.arc(W, W, R, BEGIN * Math.PI, SHOW * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        let X = Ri * (1 - Math.cos((((END - BEGIN) * percent) - 0.08) * Math.PI));
        let Y = Ri * (1 - Math.sin((((END - BEGIN) * percent) - 0.08) * Math.PI));
        ctx.arc(X, Y, 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    render() {
        return <div style={{
            margin: '0 auto',
            width: '100%',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translate(-50%, 0)',
                bottom: '0',
                textAlign: 'center',
                fontSize: '12px',
                color: '#fff'
            }}>
                {this.props.children}
            </div>
            <div style={{margin: '0 auto', width: drawWidth / 5 + 'px', height: drawHeight / 5 + 'px',}}>
                <canvas
                    width={drawWidth}
                    height={drawHeight}
                    ref={component => this.circle = component}
                    style={{
                        width: drawWidth / 5 + 'px',
                        height: drawHeight / 5 + 'px',
                    }}
                >
                </canvas>
            </div>
        </div>
    }
}
