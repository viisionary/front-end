import React from 'react';
import './Picker.scss';
import PropTypes from 'prop-types';
import IScroll from 'iscroll/build/iscroll-probe.js'
import ReactDOM from 'react-dom'

class SlideUp extends React.Component {
    render() {
        return (
            <div className={`slide-up ${this.props.isShown ? '' : 'show'}`}>
                    <div className="slide-header">
                        <div className="header-cacel-btn" onClick={this.props.onCancel}>取消</div>
                        <div className="header-confirm-btn" onClick={this.props.onConfirm}>确定</div>
                        <div className="header-title">{this.props.title}</div>
                    </div>
                    <div className="slide-content">{this.props.children}</div>
            </div>
        );
    }
}

SlideUp.propTypes = {
    title: PropTypes.string,
    isShown: PropTypes.bool,
    isShow: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
};

SlideUp.defaultProps = {
    isShown: false
};

class PickerBg extends React.Component {
    render() {
        return (
            <ul className="picker-bg" style={{height: this.props.height, backgroundColor: this.props.background}}>
                <li className="picker-bg-item"/>
                <li className="picker-bg-item"/>
                <li className="picker-bg-item"/>
            </ul>
        );
    }
}

PickerBg.propTypes = {
    height: PropTypes.string,
    background: PropTypes.string
};

PickerBg.defaultProps = {
    background: '#fff',
    height: '200px',
};

const ROWS_PER_PAGE = 3;

class Scroller extends React.Component {
    constructor(props) {
        super(props);
        this.bindFunc();
        this.state = {
            snapHeight: 0,
            activeIndex: 0
        }
    }

    componentWillMount() {
        this.setState({
            activeIndex: this.props.activeIndex
        });
    }

    componentDidMount() {
        let pickerDOM = ReactDOM.findDOMNode(this);
        let rowHeight = pickerDOM.offsetHeight / ROWS_PER_PAGE;
        let scrollOption = {
            scrollX: false,
            scrollY: true,
            momentum: true,
            snap: 'li',
            keyBindings: true,
            mouseWheel: true,
            checkDOMChanges: true
        };
        this.setState({
            snapHeight: rowHeight
        });
        this.IScroll = new IScroll(pickerDOM, scrollOption);
        this.IScroll.on('scrollEnd', this._onScrollEnd.bind(this));
        const {activeIndex} = this.state;
        this.props.onItemSelected.call(null, activeIndex, this.props.items[activeIndex]);
        this.resetScroller();
    }

    componentWillUnmount() {
        if (this.IScroll) {
            this.IScroll.destroy();
            this.IScroll = null;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.items.length !== this.props.items.length ||
            nextProps.activeIndex !== this.props.activeIndex) {

            this.setState({
                activeIndex: nextProps.activeIndex,
            });

            this.resetScroller();
        }
        let pickerDOM = ReactDOM.findDOMNode(this);
        let rowHeight = pickerDOM.offsetHeight / ROWS_PER_PAGE;
        this.setState({
            snapHeight: rowHeight
        })
    }

    resetScroller() {
        setTimeout(() => {
            this.IScroll = null;
            let pickerDOM = ReactDOM.findDOMNode(this);
            let scrollOption = {
                scrollX: false,
                scrollY: true,
                momentum: true,
                snap: 'li',
                keyBindings: true,
                mouseWheel: true,
                checkDOMChanges: true
            };
            this.IScroll = new IScroll(pickerDOM, scrollOption);
            this.IScroll.refresh();
            this.IScroll.scrollTo(0, this.state.snapHeight * this.props.activeIndex * -1, 300);
        }, 0)
    }

    _onScrollEnd() {
        let activeIndex = Math.round(Math.abs(this.IScroll.y) / this.state.snapHeight);
        this.setState({
            activeIndex: activeIndex
        });
        if (typeof this.props.onItemSelected === 'function') {
            this.props.onItemSelected.call(null, activeIndex, this.props.items[activeIndex]);
        }
    }

    render() {
        const {items} = this.props;
        return (
            <div className="scroller-wrapper">
                <ul className="scroller">
                    {this._getChildren()}
                </ul>
            </div>
        );
    }

    _getPlaceHolder(key) {
        return (<li className="item" style={{height: this.state.snapHeight}} key={key}/>);
    }

    _getChildren() {
        let children = this.props.items.map((item, index) => {
            let className = "item " + (index === this.state.activeIndex ? 'active' : '');
            return (
                <li className={className} style={{height: this.state.snapHeight, justifyContent: this._getAlignment()}}
                    key={index}>{item.value}</li>);
        });
        return [this._getPlaceHolder(-1), ...children, this._getPlaceHolder(-2)];
    }

    _getAlignment() {
        let align = this.props.align.toUpperCase();
        switch (align) {
            case 'CENTER':
                return 'center';
            case 'LEFT' :
                return 'flex-start';
            case 'RIGHT' :
                return 'flex-end';
        }
    }

    bindFunc() {
        this._getChildren.bind(this);
        this._getPlaceHolder.bind(this);
        this._onScrollEnd.bind(this);
        this._getAlignment.bind(this);
        this.resetScroller.bind(this);
    }
}

Scroller.propTypes = {
    items: PropTypes.array,
    activeIndex: PropTypes.number,
    align: PropTypes.string, //center left right
    onItemSelected: PropTypes.func,
};

Scroller.defaultProps = {
    activeIndex: 0,
    align: 'center',
};


export default class Picker extends React.Component {
    constructor(props) {
        super(props);
        this._bindFunc();
    }

    render() {
        return (
            <SlideUp isShown={this.props.shown}
                     isShow={this.props.isShow} title={this.props.title} onCancel={this.props.onCancel}
                     onConfirm={this.props.onConfirm}>
                <div style={{display: 'flex', position: 'relative'}}>
                    {this._renderScrollers()}
                    <PickerBg/>
                </div>
            </SlideUp>
        );
    }

    _renderScrollers() {
        return this.props.columns.map((column, index) => {
            if (column.values.length !== 0) {
                return (
                    <Scroller items={column.values} key={index} align={column.align} activeIndex={column.activeIndex}
                              onItemSelected={column.onItemSelected}/>);
            } else {
                return null
            }

        });
    }

    _bindFunc() {
        this._renderScrollers.bind(this);
    }
}

Picker.propTypes = {
    columns: PropTypes.array,
    shown: PropTypes.bool,
    title: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
};