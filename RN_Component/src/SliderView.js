import {Image, PanResponder, Text, View,} from 'react-native';
import React from "react";
import {PixelUtil} from "../utils/PixelUtil";
import PropTypes from 'prop-types';

export default class SliderView extends React.Component {
    static propTypes = {
        padding: PropTypes.number,
        ImgWidth: PropTypes.number,
        ImgHeight: PropTypes.number,
        maxValue: PropTypes.number,
        minValue: PropTypes.number,
        step: PropTypes.number,
        thumbImg: PropTypes.object,
        thumbColor: PropTypes.string,
        leftTrackColor: PropTypes.string,
        rightTrackColor: PropTypes.string,
        trackHeight: PropTypes.number,
        onValueChange: PropTypes.func,
        endMove: PropTypes.func
    };

    componentWillMount() {
        //this.defaultPosition()
        this._panGesture = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderTerminate: (evt) => false,
            onPanResponderGrant: (evt, gestureState) => {
                let X = gestureState.x0;
                this.dealThumb(X);
            },
            onPanResponderMove: (evt, gestureState) => {
                let X = gestureState.moveX;
                this.dealThumb(X);
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (this.props.endMove) {
                    this.props.endMove();
                }
            },
        })
    }

    componentWillUnmount() {
        this._panGesture = null;
    }

    defaultPosition(){
        const {ImgWidth, padding, maxValue,minValue,defaultValue} = this.props;
        let p = defaultValue / (maxValue-minValue) * TotalWidth;
        let TotalWidth = PixelUtil.width - padding * 2 - ImgWidth;
        this.setState({
            positionX: p,
            value: value
        })
    
    }

    setValue(value){
        const {ImgWidth, padding, maxValue, minValue,onValueChange} = this.props;
        let TotalWidth = PixelUtil.wPercent(1) - padding * 2 - ImgWidth - 200;
        let p = value / (maxValue - minValue) * PixelUtil.wPercent(1);
        let LeftPosition = padding + ImgWidth / 2;
        let RightPosition = PixelUtil.wPercent(1) - padding - ImgWidth / 2;
        if (p < LeftPosition) {
            p = 0
        } else if (p >= RightPosition) {
            // ***
            p = RightPosition - padding - ImgWidth / 2
        } else {
            p = p - padding - ImgWidth*2
        }

        this.setState({
            positionX: p,
            value: value
        })
        onValueChange(value)
    }

    dealThumb(X) {
        const {ImgWidth, padding} = this.props;
        let LeftPosition = padding + ImgWidth / 2;
        let RightPosition = PixelUtil.width - padding - ImgWidth / 2;
        if (X < LeftPosition) {
            X = 0
        } else if (X >= RightPosition) {
            X = RightPosition - padding - ImgWidth / 2
        } else {
            X = X - padding - ImgWidth / 2
        }
        this.setState({
            positionX: X
        });
        this.dealValue(X);
    }

    dealValue(XPosition) {
        const {ImgWidth, padding, maxValue, minValue, onValueChange} = this.props;
        let TotalWidth = PixelUtil.width - padding * 2 - ImgWidth;
        let M = padding - (ImgWidth / 2);
        let percent = (XPosition) / (TotalWidth);
        if (XPosition - M === 0) {
            percent = 0;
        }
        let value = Number.parseInt(minValue + percent * (maxValue - minValue));
        if (this.props.step) {
            value = this.dealStep(value, 0);
        }
        if (value < this.props.minValue) {
            value = this.props.minValue;
        } else if (value > this.props.maxValue) {
            value = this.props.maxValue;
        }
        this.setState({value: value});
        if (onValueChange) {
            onValueChange(value)
        }
    }

    dealStep(v, n) {
        const {step, minValue} = this.props;
        // let step =1;
        if (v <= minValue + step * n) {
            return minValue + step * n
        } else {
            n++;
            return this.dealStep(v, n)
        }
    }

    getValue() {
        return this.state.value ? this.state.value : this.props.minValue
    }

    constructor(props) {
        super(props);
        this.state = {
            positionX: 0,
            value: 0
        }
    }

    renderThumb() {
        const {thumbImg, ImgWidth, ImgHeight, thumbColor} = this.props;
        let thumbStyle = {
            backgroundColor: thumbColor ? thumbColor : '#000',
            width: ImgWidth,
            height: ImgHeight,
            position: 'absolute',
            top: 0,
            borderRadius: ImgWidth / 2,
            shadowColor: '#000',
            shadowOffset: {width: 10, height: 10},
            left: this.state.positionX
        };
        let thumbImgStyle = {
            width: ImgWidth,
            height: ImgHeight,
            position: 'absolute',
            top: 21,
            left: this.state.positionX
        };
        return (
            thumbImg ?
                <Image
                    source={thumbImg.source}
                    style={thumbImgStyle}
                /> : <View style={thumbStyle}/>
        )
    }

    render() {
        const {leftTrackColor, rightTrackColor, trackHeight, ImgWidth, ImgHeight} = this.props;
        const {positionX} = this.state;
        return <View
            ref={(component) => this.Slider = component}
            {...this._panGesture.panHandlers}
            style={{
                paddingVertical: ImgHeight - trackHeight,
                paddingHorizontal: ImgWidth / 2,
                backgroundColor: '#fff'
            }}
        >
            <View
                style={{flexDirection: 'row', height: trackHeight, backgroundColor: rightTrackColor}}>
                <View style={{
                    backgroundColor: leftTrackColor,
                    height: trackHeight,
                    width: positionX,
                    borderRadius: trackHeight / 2,
                }}/>
                <View style={{height: 6, borderRadius: trackHeight / 2}}/>
            </View>
            {this.renderThumb()}
        </View>
    }
}