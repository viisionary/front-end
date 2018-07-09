import React from 'react';
import {PanResponder, Text, View,} from 'react-native';

const letters = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class SlideBar extends React.Component {

    componentWillMount() {
        this._panGesture = PanResponder.create({
            //要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                this.dealDot(gestureState.y0);
            },
            onPanResponderMove: (evt, gestureState) => {
                this.dealDot(gestureState.moveY);
            },
            // onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                this.closeTip();
            },
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            imgTop: 0,
            letter: ''
        }

    }

    closeTip() {
        this.props.close();
    }

    dealDot(y) {
        y = y - 75;
        let num = y / 16;
        let index = Math.floor(num) + 1;
        let letter = letters[index];
        if (this.letter !== letter) {
            this.letter = letter;
            this.props.onSelect(this.letter);
        }
        // this.setState({
        //     imgTop: index * 16
        // })
    }

    componentWillUnmount() {
        this._panGesture = null;
    }

    // <View style={{
    // height: 16,
    // width: 16,
    // borderRadius: 8,
    // backgroundColor: '#d7d7d7',
    // position: 'absolute',
    // top: this.state.imgTop
    // />

    render() {
        return (
            <View
                {...this._panGesture.panHandlers}
                style={{
                    width: 30,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    ...this.props.style
                }}
            >

                {letters.map((item, index) => (
                    <Text key={index}
                          style={{color: '#999999', fontSize: 12, height: 16, paddingHorizontal: 2}}>
                        {item}
                    </Text>
                ))}
            </View>
        );
    }

}

export default SlideBar;