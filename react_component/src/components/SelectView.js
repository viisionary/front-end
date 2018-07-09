import React from 'react';
import PropTypes from 'prop-types';

class SelectView extends React.Component {

    setPropsInputValue(value) {
        if (this.props.onValueChange) {
            this.props.onValueChange(value);
        }
    }

    handleFocus = () => {
    };
    handleBlur = () => {

    };

    render() {

        const {
            style,
            selectStyle,
            left,
            right,
            options,
            placeholder,
            className,
            id
        } = this.props;

        let myOptions = options.slice();
        myOptions.unshift({key: '', value: placeholder});
        return (
            <div className={className}
                 style={{...SelectStyle.container, ...style}}>
                {left}
                <select
                    dir="rtl"
                    id={id}
                    style={{...SelectStyle.select, ...selectStyle}}
                    onChange={(e) => {
                        this.setPropsInputValue(e.target.value);
                    }}>
                    {/*onFocus={this.handleFocus}*/}
                    {/*onBlur={this.handleBlur}*/}
                    {myOptions.map((item, index) => {
                        const {key, value} = item;
                        if (index === 0) {
                            return (<option key={index} value={key} disabled selected style={{display:'none'}}>{value}</option>)
                        }
                        return (
                            <option key={index} value={key}>{value}</option>
                        );
                    })}
                </select>
                {right}
            </div>
        );
    }

}

SelectView.propTypes = {
    style: PropTypes.object,
    selectStyle: PropTypes.object,
    onValueChange: PropTypes.func.isRequired,
    left: PropTypes.element,
    right: PropTypes.element,
    focusStyle: PropTypes.object,
    options: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
};

const SelectStyle = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    select: {
        flexGrow: 1
    }
};

export default SelectView;