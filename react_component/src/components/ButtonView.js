import React from 'react'
import PropTypes from 'prop-types';
import {PressTouch} from "./ViewConfig";

export class IconButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            press: '1',
            disable: false
        }
    }

    static propTypes = {
        imgUrl: PropTypes.string.isRequired,
        className: PropTypes.string,
        style: PropTypes.object,
        onClick: PropTypes.func
    };

    handleMouseDown = () => {
        this.setState({
            press: '0.5'
        })
    };
    handleMouseUp = () => {
        this.setState({
            press: '1'
        })
    };

    render() {
        const {imgUrl, style, onClick, className, imgClassname, text} = this.props;
        const {press} = this.state;
        const rootStyle = {
            textAlign: 'center',
            opacity: press
        };
        return (<button className={className}
                        onClick={onClick}
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}
                        onTouchStart={this.handleMouseDown}
                        onTouchEnd={this.handleMouseUp}
                        style={rootStyle}>
            <img src={imgUrl} alt="" className={imgClassname}/>
            <span>{text}</span>
        </button>)
    }
}

export class CommonButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            press: '1'
        }
    }

    static propTypes = {
        style: PropTypes.object,
        text: PropTypes.string.isRequired,
        className: PropTypes.string,
        onClick: PropTypes.func
    };
    handleMouseDown = () => {
        this.setState({
            press: '0.5'
        })
    };
    handleMouseUp = () => {
        this.setState({
            press: '1'
        })
    };

    render() {
        const {style, text, className, onClick} = this.props;
        const {press} = this.state;

        const rootStyle = {
            textAlign: 'center',
            opacity: press

        };
        return (<button className={className}
                        onClick={onClick}
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}
                        onTouchStart={this.handleMouseDown}
                        onTouchEnd={this.handleMouseUp}
                        style={rootStyle}>
            <span>{text}</span>
        </button>)
    }
}

export class PressTouchMiddle extends React.Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        className: PropTypes.string,
        onClick: PropTypes.func
    };
    render() {
        const {text, className, onClick} = this.props;
        return (
            <PressTouch
            className={className}
            onClick={onClick}
            >
                <p>{text}</p>
            </PressTouch>
        );

    }
}

export class TextButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            press: '1'
        }
    }

    static propTypes = {
        style: PropTypes.object,
        text: PropTypes.string.isRequired,
        className: PropTypes.string,
        onClick: PropTypes.func
    };
    handleMouseDown = () => {
        this.setState({
            press: '0.5'
        })
    };
    handleMouseUp = () => {
        this.setState({
            press: '1'
        })
    };

    setText = (text) => {
        this.setState({stateText: text})
    };

    setDisable = (bool) => {
        this.setState({disable: bool})
    };

    render() {
        const {style, text, className, onClick} = this.props;
        const {press, stateText, disable} = this.state;
        const rootStyle = {
            // backgroundColor: 'blue'
            textAlign: 'center',
            opacity: press

        };
        return (<button
            disabled={disable}
            onClick={onClick}
            className={className}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onTouchStart={this.handleMouseDown}
            onTouchEnd={this.handleMouseUp}
            style={rootStyle}>
            <span>{stateText ? stateText : text}</span>
        </button>)
    }

}
