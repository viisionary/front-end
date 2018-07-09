import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    ART,
    PanResponder, Text,
    Platform
} from 'react-native';
import { PixelUtil } from '../utils/PixelUtil';

const {Group, Path, Shape, Surface} = ART;

const PathStr = 'M{0},{1} A{2},{3} 0 {4},{5} {6},{7}';

const convert = 2 * Math.PI / 360;
const DashMarginTop = 7;

class DashboardView extends React.PureComponent {

    setProgress(progress) {
        this.setState({progress});
        this.props.onValueChange && this.props.onValueChange(progress);
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                const {locationX, locationY} = evt.nativeEvent;
                this.convertXYToProgress(locationX, locationY);
                this.props.onTouchStart && this.props.onTouchStart();
            },
            onPanResponderMove: (evt, gestureState) => {
                const {locationX, locationY} = evt.nativeEvent;
                this.convertXYToProgress(locationX, locationY);
            },
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderRelease: (evt, gestureState) => {
                this.props.onTouchEnd && this.props.onTouchEnd();
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                return true;
            },
        });
    }

    componentWillReceiveProps(nextProps) {
        //如果progress不在区间内重新设置progress
        const {totalNum, minNum} = nextProps;
        const {progress} = this.state;
        if (progress > totalNum) {
            this.setState({progress: totalNum});
        } else if (progress < minNum) {
            this.setState({progress: minNum});
        }
    }


    componentWillUnmount() {
        this._panResponder = null;
    }

    constructor(props) {
        super(props);
        this.initPoint();
        this.state = {
            progress: this.props.minNum,
        };
    }

    initPoint() {
        const {radius, offset, progressWidth, dashWidth} = this.props;

        this.trueRadius = radius + progressWidth;//真正的圆心（半径）

        this.startDegree = 180 - offset;//初始角度
        this.endDegree = 360 + offset;//结束角度

        //背景path
        this.bgPath = this.circlePath(this.trueRadius, this.trueRadius, radius, this.startDegree, this.endDegree);
        this.bgTopLinePath = this.circlePath(this.trueRadius, this.trueRadius, radius + progressWidth / 2 + 1, this.startDegree, this.endDegree);
        this.bgBottomLinePath = this.circlePath(this.trueRadius, this.trueRadius, radius - progressWidth / 2 - 1, this.startDegree, this.endDegree);
        this.startPoint = this.calculatePoint(this.trueRadius, this.trueRadius, radius, this.startDegree);
        this.bgLeftCornerPath = this.circlePath(this.startPoint.x, this.startPoint.y, progressWidth / 2, 0, 160);
        let endPoint = this.calculatePoint(this.trueRadius, this.trueRadius, radius, this.endDegree);
        this.bgRightCornerPath = this.circlePath(endPoint.x, endPoint.y, progressWidth / 2 + 1, 10, 190);
        //dash
        let dashRadius = radius - dashWidth - DashMarginTop;//dash半径
        this.dashPath = this.circlePath(this.trueRadius, this.trueRadius, dashRadius, this.startDegree, this.endDegree);

    }

    render() {

        const {
            radius,
            progressColor,
            progressWidth,
            bgProgressColor,
            totalNum,
            offset,
            dashWidth,
            dashColor,
            pointColor,
            pointRadius,
            pointBorderColor,
            textStyle
        } = this.props;
        const {
            progress,
        } = this.state;

        const wh = (radius + progressWidth) * 2;
        //pro
        let endDu = progress === 0 ? this.startDegree + 1 : this.convertValueToDu(progress);
        let proPath = this.circlePath(this.trueRadius, this.trueRadius, radius, this.startDegree, endDu);

        //点
        let point = this.calculatePoint(this.trueRadius, this.trueRadius, radius, endDu);
        let pointPath = this.circlePath(point.x, point.y, pointRadius, 0, 360);

        const dash = Platform.OS === 'ios' ? {strokeDash: [1, 5]} : {strokeDash: [1, 12]};

        return (
            <View
                style={{width: wh, height: this.startPoint.y + 10, ...DashStyle.container}}
                {...this._panResponder.panHandlers}
            >
                <View style={DashStyle.art}>
                    <Surface width={wh} height={wh}>
                        <Group>
                            <Shape d={this.bgLeftCornerPath} stroke={pointBorderColor} strokeWidth={2}/>
                            <Shape d={this.bgPath} stroke={bgProgressColor} strokeWidth={progressWidth}/>
                            <Shape d={this.bgTopLinePath} stroke={pointBorderColor} strokeWidth={1}/>
                            <Shape d={this.bgBottomLinePath} stroke={pointBorderColor} strokeWidth={1}/>
                            <Shape d={this.bgRightCornerPath} stroke={pointBorderColor} strokeWidth={1}/>

                            <Shape d={this.dashPath} stroke={dashColor} strokeWidth={dashWidth} {...dash}/>

                            <Shape d={proPath} stroke={progressColor} strokeWidth={progressWidth}/>

                            <Shape d={pointPath} stroke={pointBorderColor} strokeWidth={1} fill={pointColor}/>

                        </Group>
                    </Surface>
                </View>
                <Text style={textStyle}>
                    {this.props.getShowText(progress)}
                </Text>
            </View>
        );
    }

    convertValueToDu(value) {
        const {totalNum, offset} = this.props;
        let pre = value / totalNum;
        let totalDegree = 180 + offset * 2;
        let degree = totalDegree * pre;

        return this.startDegree + degree;

    }

    /**
     * 画圆
     * @param cx
     * @param cy
     * @param r
     * @param startDegree
     * @param endDegree
     */
    circlePath(cx, cy, r, startDegree, endDegree) {
        let p = Path();
        let startPoint = this.calculatePoint(cx, cy, r, startDegree);
        p.path.push(0, startPoint.x, startPoint.y);
        p.path.push(4, cx, cy, r, startDegree * Math.PI / 180, (endDegree * .9999) * Math.PI / 180, 1);
        return p;
    }

    /**
     * 计算初始坐标
     * @param cx
     * @param cy
     * @param r
     * @param degree
     * @returns {*}
     */
    calculatePoint(cx, cy, r, targetDegree) {
        let degree = targetDegree % 360;
        if (degree <= 90) {
            let x = cx + r * Math.cos(degree * convert);
            let y = cy + r * Math.sin(degree * convert);
            return {x, y};
        } else if (degree <= 180) {
            let trueDegree = degree - 90;
            let x = cx - r * Math.sin(trueDegree * convert);
            let y = cy + r * Math.cos(trueDegree * convert);
            return {x, y};
        } else if (degree <= 270) {
            let trueDegree = degree - 180;
            let x = cx - r * Math.cos(trueDegree * convert);
            let y = cy - r * Math.sin(trueDegree * convert);
            return {x, y};
        } else if (degree <= 360) {
            let trueDegree = degree - 270;
            let x = cx + r * Math.sin(trueDegree * convert);
            let y = cy - r * Math.cos(trueDegree * convert);
            return {x, y};
        }
    }

    convertXYToProgress(locationX, locationY) {

        const {offset, totalNum, gap, minNum} = this.props;
        let du = getDuFromXY(locationX, locationY, this.trueRadius, offset);

        let totalDegree = 180 + offset * 2;
        let value = du / totalDegree * totalNum;

        //根据间隔处理
        let zheng = parseInt(value / gap, 10);
        let yu = value % gap;
        let progress = yu >= gap / 2 ? zheng + 1 : zheng;
        progress = progress * gap;
        if (progress < minNum || progress > totalNum) {
            return;
        }
        if (progress === this.state.progress) {
            return;
        }

        this.setProgress(progress);
    }

}

/**
 * 移动计算
 * @param locationX
 * @param locationY
 * @param truRadius
 * @returns {null}
 */
function getDuFromXY(locationX, locationY, truRadius, offset) {
    if (locationX < 0 || locationY < 0) {
        return -1;
    }
    if (locationX < truRadius && locationY >= truRadius) {
        let ver = locationY - truRadius;
        let hor = truRadius - locationX;
        let du = Math.atan(ver / hor);
        let trueDu = du / convert;
        if (trueDu <= offset) {
            return offset - trueDu;
        } else {
            return 0;
        }
    } else if (locationX <= truRadius && locationY < truRadius) {
        let ver = truRadius - locationY;
        let hor = truRadius - locationX;
        let du = Math.atan(ver / hor);
        let trueDu = du / convert;
        return trueDu + offset;
    } else if (locationX > truRadius && locationY <= truRadius) {
        let ver = truRadius - locationY;
        let hor = locationX - truRadius;
        let du = Math.atan(hor / ver);
        let trueDu = du / convert;
        return trueDu + 90 + offset;
    } else if (locationX > truRadius && locationY > truRadius) {
        let ver = locationY - truRadius;
        let hor = locationX - truRadius;
        let du = Math.atan(ver / hor);
        let trueDu = du / convert;
        if (trueDu <= offset) {
            return trueDu + 180 + offset;
        } else {
            return offset + 180 + offset;
        }
    }
    return -1;
}

const DashStyle = {
    art: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
};

DashboardView.propTypes = {
    style: PropTypes.object,

    progressWidth: PropTypes.number,//进度圆弧宽度
    progressColor: PropTypes.string,//进度圆弧颜色
    bgProgressColor: PropTypes.string,//底部圆弧颜色

    radius: PropTypes.number,//半径
    offset: PropTypes.number,//偏移角度 0-90

    totalNum: PropTypes.number.isRequired,
    minNum: PropTypes.number,
    gap: PropTypes.number,//间隔

    dashWidth: PropTypes.number,
    dashColor: PropTypes.string,

    pointRadius: PropTypes.number,
    pointColor: PropTypes.string,
    pointBorderColor: PropTypes.string,

    getShowText: PropTypes.func.isRequired,
    onValueChange: PropTypes.func,
    textStyle: PropTypes.object,

    onTouchStart: PropTypes.func,
    onTouchEnd: PropTypes.func

};
DashboardView.defaultProps = {
    progressWidth: 8,
    progressColor: '#C87AF7',
    bgProgressColor: '#6571FD',

    radius: PixelUtil.wPercent(0.3),
    offset: 10,

    minNum: 0,

    dashWidth: 2,
    dashColor: '#9576FB',

    pointRadius: 8,
    pointColor: '#9576FB',
    pointBorderColor: '#fff',

    gap: 1,
};

export default DashboardView;