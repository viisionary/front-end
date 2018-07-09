import React from 'react';
import PropTypes from 'prop-types';
import ProgressView from "./ProgressView";

const AlertProgress = (props) => {
    const {color, progressMsg} = props;
    return (
        <div style={{
            backgroundColor: "white",
            borderRadius: "5px",
            width: "80%",
            margin: "auto",
            padding: '10px',
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>
            <ProgressView visibility={true} color={color}/>
            <p>{progressMsg ? progressMsg : '正在加载...'}</p>
        </div>
    );
};

AlertProgress.propTypes = {
    color: PropTypes.string,
    progressMsg: PropTypes.string
};

export default AlertProgress;