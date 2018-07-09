import React from 'react';
import PropTypes from 'prop-types';


import {Modal, ScrollView, Text, TouchableOpacity, View,} from 'react-native';

import styles from './style';
import Config from "../../Config";

let componentIndex = 0;

const propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    initValue: PropTypes.string,
    style: PropTypes.object,
    selectStyle: PropTypes.object,
    optionStyle: PropTypes.object,
    optionTextStyle: PropTypes.object,
    sectionStyle: PropTypes.object,
    sectionTextStyle: PropTypes.object,
    cancelStyle: PropTypes.object,
    cancelTextStyle: PropTypes.object,
    overlayStyle: PropTypes.object,
    cancelText: PropTypes.string,
    leftRender: PropTypes.element,
    placeholder: PropTypes.string,
    keyName: PropTypes.string,
    valueName: PropTypes.string
};

const defaultProps = {
    data: [],
    onChange: () => {
    },
    initValue: '',
    style: {},
    selectStyle: {},
    optionStyle: {},
    optionTextStyle: {},
    sectionStyle: {},
    sectionTextStyle: {},
    cancelStyle: {},
    cancelTextStyle: {},
    overlayStyle: {},
    cancelText: '取消'
};

export default class ModalPicker extends React.Component {

    constructor() {

        super();

        this.onChange = this.onChange.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.renderChildren = this.renderChildren.bind(this);

        this.state = {
            animationType: 'slide',
            modalVisible: false,
            transparent: false,
            selectedID: '',
            selectedValue: ''
        };
    }

    componentDidMount() {
        this.setState({selected: this.props.initValue});
        this.setState({cancelText: this.props.cancelText});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initValue != this.props.initValue) {
            this.setState({selected: nextProps.initValue});
        }
    }

    onChange(item) {
        this.props.onChange(item);
        this.setState({selectedID: item[this.props.keyName], selectedValue: item[this.props.valueName]});
        this.close();
    }

    close() {
        this.setState({
            modalVisible: false
        });
    }

    open() {
        this.setState({
            modalVisible: true
        });
    }

    renderSection(section) {
        return (
            <View key={section.key} style={[styles.sectionStyle, this.props.sectionStyle]}>
                <Text
                    style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>{section[this.props.valueName]}</Text>
            </View>
        );
    }

    renderOption(option) {
        return (
            <TouchableOpacity key={option.key} onPress={() => this.onChange(option)}>
                <View style={[styles.optionStyle, this.props.optionStyle]}>
                    <Text
                        style={[styles.optionTextStyle, this.props.optionTextStyle]}>{option[this.props.valueName]}</Text>
                </View>
            </TouchableOpacity>)
    }

    renderOptionList() {
        let options = this.props.data.map((item) => {
            if (!item[this.props.valueName]) {
                return this.renderSection(item);
            } else {
                return this.renderOption(item);
            }
        });

        return (
            <View style={[styles.overlayStyle, this.props.overlayStyle]} key={'modalPicker' + (componentIndex++)}>
                <View style={styles.optionContainer}>
                    <ScrollView keyboardShouldPersistTaps='always'>
                        <View style={{paddingHorizontal: 10}}>
                            {options}
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.cancelContainer}>
                    <TouchableOpacity onPress={this.close}>
                        <View style={[styles.cancelStyle, this.props.cancelStyle]}>
                            <Text
                                style={[styles.cancelTextStyle, this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>);
    }

    renderChildren() {

        if (this.props.children) {
            return this.props.children;
        }
        return (
            <View style={[styles.selectStyle, this.props.selectStyle]}>
                <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>{this.state.selectedValue}</Text>
            </View>
        );
    }

    render() {

        const dp = (
            <Modal transparent={true}
                   ref="modal"
                   visible={this.state.modalVisible}
                   onRequestClose={this.close}
                   animationType={this.state.animationType}>
                {this.renderOptionList()}
            </Modal>
        );

        const {placeholder} = this.props;
        const {selectedValue} = this.state;
        let text = selectedValue ? selectedValue : placeholder;
        let textColor = {color: selectedValue ? 'black' : Config.FontColor, fontSize: 14};
        return (
            <View style={{paddingVertical: 8, paddingLeft: 3, ...this.props.style}}>
                {dp}
                <TouchableOpacity onPress={this.open}>
                    <Text style={textColor}>{text}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

ModalPicker.propTypes = propTypes;
ModalPicker.defaultProps = defaultProps;