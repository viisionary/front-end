import React from 'react';
import PropTypes from 'prop-types';
import PressTouch from "./PressTouch";

const AlertOperate = (props) => {
    const { operateMsg, isHint, sureCallback, cancelCallback} = props;
    const btnSureStyle = {
        display:'inline-block',
        width:'50%',
        textAlign:'center',

    };
    return (
        <div style={AOStyle.container}>
            <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'1.14rem'}}>{operateMsg}</p>
            {!isHint? <div style={AOStyle.operate}>
                <OperateBtn style={AOStyle.operateBtnCancel} text='取消' callback={cancelCallback}/>
                <OperateBtn style={btnSureStyle} text='确认' callback={sureCallback}/>
            </div>:  <div style={AOStyle.operate}>  <OperateBtn style={btnSureStyle} text='确认' callback={sureCallback}/>
            </div>}
        </div>
    );
};

const OperateBtn = (props) => {
    const {style, text, callback} = props;
    return (
        <PressTouch
            style={{...AOStyle.operateBtn, ...style}}
            onClick={callback}>
            <span>{text}</span>
        </PressTouch>
    );
};

AlertOperate.propTypes = {
    color: PropTypes.string,
    operateTitle: PropTypes.string.isRequired,
    operateMsg: PropTypes.string.isRequired,
    isHint: PropTypes.bool,
    sureCallback: PropTypes.func,
    cancelCallback: PropTypes.func,
};

const AOStyle = {
    container: {
        position:'relative',
        backgroundColor: "#f7f7f7",
        borderRadius: "10px",
        width: "14rem",
        height:'8rem',
        margin: "auto",
    },
    operate: {
        position:'absolute',
        bottom:'0',
        width:'100%',
        height:'3rem',
        lineHeight:'3rem',
        fontSize:'1rem',
        color:'rgb(50,134,254)',
        textAlign:'center',
    },
    operateBtnCancel: {
        display:'inline-block',
        width:'50%',
        textAlign:'center',
    }
};

export default AlertOperate;