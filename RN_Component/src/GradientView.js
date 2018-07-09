import React from 'react';
import PropTypes from 'prop-types';
import {ART, View, Text} from 'react-native';
import {PixelUtil} from "../utils/PixelUtil";

const {Surface, Shape, Path, LinearGradient} = ART;

class GradientView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };
    }

    render() {

        const {style, startColor, endColor, borderRadius} = this.props;
        const {width, height} = this.state;
        // console.log(borderRadius.toString().split(' '));
        const pathS = new Path()
            .moveTo(0, 0)
            .lineTo(0, height)
            .lineTo(width, height)
            .lineTo(width, 0)
            .close();

        const pathR = new Path()
            .moveTo((width - height / 2), 0)
            .arc(0, height, height / 4)
            .arcTo(height / 2, height)
            .arc(0, -height, height / 4)
            .close();

        const path = borderRadius ? pathR : pathS;

        let linearGradient = new LinearGradient({
                '0': startColor, // blue in 1% position
                '1': endColor // opacity white in 100% position
            },
            0, height, width, height
        );

        return (
            <View
                style={{...style}}
                onLayout={(e) => {
                    let width = e.nativeEvent.layout.width;
                    let height = e.nativeEvent.layout.height;
                    this.setState({width, height});
                }}>
                <View style={{position: 'absolute', top: 0, left: 0}}>
                    <Surface width={width} height={height}>
                        <Shape d={path} fill={linearGradient}/>
                    </Surface>
                </View>
                {this.props.children}
            </View>
        );
    }

}

GradientView.propTypes = {
    style: PropTypes.object,
    startColor: PropTypes.string.isRequired,
    endColor: PropTypes.string.isRequired,
    borderRadius: PropTypes.bool
};

export default GradientView;