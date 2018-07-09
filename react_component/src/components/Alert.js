import React from 'react';
import Modal from 'react-modal';
import AlertProgress from "./AlertProgress";
import AlertOperate from "./AlertOperate";

Modal.setAppElement('#root');

class Alert extends React.Component {
    /**
     * 显示 progress
     */
    showProgress(color, progressMsg) {
        let mode = Alert.MODE_PROGRESS;
        this.setState({visible: true, mode, color, progressMsg});
    }

    /**
     * 显示 hint
     */
    showHint(color, operateTitle, operateMsg, callback) {
        this.opeSureCallback = callback;
        let mode = Alert.MODE_HINT;
        this.setState({visible: true, mode, color, operateTitle, operateMsg});
    }

    /**
     * 显示 operate
     */
    showOperate(color, operateTitle, operateMsg, sureCallback, cancelCallback) {
        this.opeSureCallback = sureCallback;
        this.opeCancelCallback = cancelCallback;
        let mode = Alert.MODE_OPERATE;
        this.setState({visible: true, mode, color, operateTitle, operateMsg});
    }

    /**
     * 显示 extra
     */
    showExtra() {
        let mode = Alert.MODE_EXTRA;
        this.setState({visible: true, mode});
    }

    /**
     * dismiss alert
     */
    dismiss() {
        this.setState({visible: false});
        this.opeSureCallback = null;
        this.opeCancelCallback = null;
    }

    /**
     * 设置Operate View
     */
    setOperateView(view) {
        this.operate = view;
    }

    /**
     * 设置Progress View
     */
    setProgressView(view) {
        this.progress = view;
    }

    /**
     * 设置Extra View
     */
    setExtraView(view) {
        this.extra = view;
    }

    constructor(props) {
        super(props);
        this.state = {
            mode: Alert.MODE_HINT,//模式
            visible: false,
            color: '',//基础颜色
            //progress
            progressMsg: '',//加载进度文字
            //operate
            operateTitle: '',//标题
            operateMsg: '',//内容
        };
        this.operate = null;//operate view
        this.progress = null;//progress view
        this.extra = null;//临时View
        this.opeSureCallback = null;//确认回掉
        this.opeCancelCallback = null;//取消回掉
    }

    handleSureClick = () => {
        this.opeSureCallback && this.opeSureCallback();
    };
    handleCancelClick = () => {
        this.opeCancelCallback && this.opeCancelCallback();
    };

    render() {
        const {visible} = this.state;

        return (
            <Modal
                isOpen={visible}
                style={AlertStyle.container}>
                {this.renderContent()}
            </Modal>
        );
    }

    renderContent() {
        const {mode} = this.state;
        if (mode === Alert.MODE_PROGRESS) {
            return this.renderProgress();
        } else if (mode === Alert.MODE_EXTRA) {
            if (this.extra) {
                return this.extra;
            }
        }
        return this.renderDefaultOperate();
    }

    renderProgress() {
        const {color, progressMsg} = this.state;
        let Progress = this.progress;
        if (Progress) {
            return <Progress msg={progressMsg}/>
        }
        return <AlertProgress color={color} progressMsg={progressMsg}/>;
    }

    renderDefaultOperate() {
        const {operateTitle, operateMsg, mode, color} = this.state;
        let Operate = this.operate;
        const isHint = mode === Alert.MODE_HINT;

        if (Operate) {
            return <Operate
                operateMsg={operateMsg}
                sureCallback={this.handleSureClick}
                cancelCallback={this.handleCancelClick}
                isHint={isHint}
            />;
        }

        return <AlertOperate
            operateTitle={operateTitle}
            operateMsg={operateMsg}
            color={color}
            isHint={isHint}
            sureCallback={this.handleSureClick}
            cancelCallback={this.handleCancelClick}
        />;
    }
}

Alert.propTypes = {};
Alert.MODE_PROGRESS = 'mode_progress';
Alert.MODE_HINT = 'mode_hint';
Alert.MODE_OPERATE = 'mode_operate';
Alert.MODE_EXTRA = 'mode_extra';

const AlertStyle = {
    container: {
        content: {
            border: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        overlay: {
            backgroundColor: 'rgba(0,0,0,0.3)',
        }
    },
    content: {
        backgroundColor: "white",
        borderRadius: "5px",
        width: "80%",
        margin: "auto",
        padding: '10px'
    }
};

export default Alert;