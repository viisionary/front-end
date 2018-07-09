import React from 'react';
import {ActionSheetIOS, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';

class ActionSheet extends React.Component {
    constructor() {
        super();
        this.state = {
            imgSource: {},
            selectedKey: '',
            selectedValue: ''
        }
    }

    static propTypes = {
        data: PropTypes.array,
        onChange: PropTypes.func,
        style: PropTypes.object,
        leftRender: PropTypes.element,
        placeholder: PropTypes.string,
        keyName: PropTypes.string,
        valueName: PropTypes.string
    };

    showActionSheet = () => {
        const {onChange} = this.props;
        let data = Array.isArray(this.props.data) ? Array.from(this.props.data) : [];
        data.push({key: '', value: '取消'});
        ActionSheetIOS.showActionSheetWithOptions({
                options: data.map((item) => item['value']),
                cancelButtonIndex: data.length - 1,
            },
            (buttonIndex) => {
                if (buttonIndex !== data.length - 1) {
                    onChange(data[buttonIndex]);
                    this.setState({
                        selectedValue: data[buttonIndex].value
                    });
                }
            });
    };

    render() {
        const {placeholder} = this.props;
        const {selectedValue} = this.state;
        let text = selectedValue ? selectedValue : placeholder;
        let textColor = {color: selectedValue ? 'black' : '#cdcdcd', fontSize: 14};
        return (
            <View style={{padding: 8, ...this.props.style}}>
                <TouchableOpacity onPress={this.showActionSheet}>
                    <Text style={textColor}>{text}</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

export default ActionSheet;