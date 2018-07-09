/**
 * Created by zhaoxi on 2017/9/25.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';
import {MyButton} from "./MyButton";
import Modal from "react-native-modal";
import BaseStyle from "../css/BaseStyle";
import {PixelUtil} from "../utils/PixelUtil";
import {DIALOG_BG} from "../const/imgs";
import MyImage from "./MyImage";
import Config from '../Config';

const {width, height} = Dimensions.get('window');

export class Dialog extends React.Component {

    showDialog(message) {
        this.setState({visible: true, message});
    }

    dismissDialog(hideCallback) {
        // 先改变message的值，再关闭
        this.hideCallback = hideCallback;
        // this.setState({visible: false, message: ''});
        this.setState({visible: false});
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
        this.hideCallback = null;
    }

    handleModalHide = () => {
        this.hideCallback && this.hideCallback();
    };

    render() {
        const {visible} = this.state;
        return (
            <Modal
                isVisible={visible}
                backdropOpacity={0.5}
                onModalHide={this.handleModalHide}>
                <View style={DialogStyle.bg}>
                    {this.renderContent ? this.renderContent() : this.props.children}
                </View>
            </Modal>
        );
    };
}

/**
 * View层覆盖
 * 注：android 不能用button；所有的根元素必须是View 切style中包含flex:1
 *
 */
export class ProgressDialog extends React.Component {

    static propTypes = {
        color: PropTypes.string,
    };

    showDialog(message) {
        this.setState({visible: true, message});
    }

    dismissDialog(hideCallback) {
        this.setState({visible: false}, () => {
            hideCallback && hideCallback();
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    render() {
        const {visible} = this.state;
        if (!visible) {
            return null;
        }
        return (
            <View style={{
                ...DialogStyle.bg,
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.5)',
                width: width,
                height: height,
                top: 0,
            }}>
                {this.renderContent()}
            </View>
        );
    }


    renderContent() {
        const {color = BaseStyle.BaseColor} = this.props;
        const {message = '正在加载...'} = this.state;

        return (
            <View style={DialogStyle.progress}>
                <ActivityIndicator
                    animating={true}
                    color={color}
                    size='large'/>
                <Text style={{marginTop: 10}}>{message}</Text>
            </View>
        );
    }

}


class ProgressDialog2 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    render() {

        let color = this.props.color;
        let text = this.props.text || '正在加载...';

        return (
            <View
                style={{
                    ...DialogStyle.bg,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: this.state.visible ? 'flex' : 'none',
                    zIndex: 999,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }}>
                <View style={DialogStyle.progress}>
                    <ActivityIndicator
                        animating={this.state.visible}
                        color={color}
                        size='large'/>
                    <Text style={{marginTop: 10}}>{text}</Text>
                </View>
            </View>
        );
    }

    open() {
        this.setState({visible: true});
    }

    close() {
        this.setState({visible: false});
    }

}

ProgressDialog.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
};

export class OperateDialog extends Dialog {

    static propTypes = {
        firstText: PropTypes.string,
        firstClick: PropTypes.func,
        secondText: PropTypes.string,
        secondClick: PropTypes.func,
    };

    renderContent() {
        const {secondText, secondClick, firstText, firstClick,} = this.props;
        const {message} = this.state;
        return (
            <View style={DialogStyle.defaultDialog}>
                {/*<View style={{height: 100}}>*/}
                <View style={DialogStyle.topImgBg}/>
                <MyImage source={DIALOG_BG.source} property={DIALOG_BG.property}
                         style={DialogStyle.topImg}/>
                {/*</View>*/}
                <Text style={{lineHeight: 40, fontSize: 18, color: 'white',position:'absolute'}}>提示</Text>
                <View style={DialogStyle.defaultCon}>
                    <Text style={{lineHeight: 20, color: 'black', fontSize: 16, textAlign: 'center'}}>{message}</Text>
                </View>
                <View style={DialogStyle.defaultOperate}>
                    {this.renderButton(firstText, firstClick, '#cacaca')}
                    {this.renderButton(secondText, secondClick, Config.BaseColor)}
                </View>
            </View>
        );
    }

    renderButton(text, click, BtnColor) {
        if (!text) return null;
        return (
            <MyButton
                style={{backgroundColor: BtnColor, ...DialogStyle.operateBtn}}
                text={text}
                textStyle={{color: 'white', fontSize: 14}}
                onPress={() => {
                    if (click) click();
                }}/>
        );
    }
}


export class Tip extends React.Component {
    constructor() {
        super();
        this.state = {
            show: false,
            letter: ''
        }
    }

    static propTypes = {
        text: PropTypes.string.isRequired
    };

    closeTip() {
        this.setState({
            show: false
        })
    }

    showTip(letter) {
        this.setState({
            show: true,
            letter: letter
        })
    }

    render() {
        return (this.state.show ?
            <View style={TipStyle}>
                <View style={{backgroundColor: 'rgba(74, 74, 74, 0.6)', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={TipTextStyle}>{this.state.letter}</Text>
                </View>
            </View>
            : null)
    }
}

const TipTextStyle = {
    color: '#fff',
    height: 70,
    width: 70,
    lineHeight: 70,
    fontSize: 23,
    textAlign: 'center'
};
const TipStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: PixelUtil.wPercent(1),
    top: 200
};

const dialog = {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
};

const DialogStyle = {
    topImg: {
        width: PixelUtil.wPercent(1)
    },
    topImgBg: {
        width: PixelUtil.wPercent(0.75),
        backgroundColor: BaseStyle.BaseColor,
        height: 40,
        position: 'absolute',
        top: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: 'hidden'
    },
    bg: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    progress: {
        ...dialog,
        paddingVertical: 20,
        width: '50%'
    },
    defaultDialog: {
        ...dialog,
        width: PixelUtil.wPercent(0.75),
        borderRadius: 15,
        // borderTopLeftRadius: 15,
        overflow: 'hidden',
        // borderTopRightRadius: 30

    },
    defaultCon: {
        // backgroundColor: BaseStyle.BaseColor,
        width: '100%',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingHorizontal: PixelUtil.wPercent(0.086),
        // paddingTop: 30,
        paddingBottom: 15,
    },
    defaultOperate: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: '7%',
    },
    operateBtn: {
        // borderColor: 'black',
        // borderWidth: 1.5,
        width: PixelUtil.wPercent(0.28),
        paddingVertical: 10,
        borderRadius: PixelUtil.wPercent(0.050),
        marginHorizontal: 8
    },


};