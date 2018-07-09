import React from 'react';
import PropTypes from 'prop-types';

const TabHeight = '4rem';
const FontNormalColor = '#666';

const TabItem = ({item}) => {
    const {icon, iconFocus, focusColor, normalColor = '#fff', isFocus, name, onClick, width} = item;
    return (
        <div
            style={{
                width,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // lineHeight: TabHeight,
                backgroundColor: isFocus ? focusColor : normalColor,
            }}
            onClick={() => {
                onClick && onClick();
            }}>
            <div style={{
                height: TabHeight,
                display: 'flex',
                alignItems: 'center',
                // justifyContent: 'center'
            }}>
                <div style={{textAlign: 'center'}}>
                    <img src={isFocus ? iconFocus : icon}
                         style={{
                             width: '1.17857rem',
                             height: '1.3142rem',
                         }}/>
                    <div style={{color: isFocus ? normalColor : FontNormalColor}}>{name}</div>
                </div>
            </div>
        </div>
    );
};

class TabView extends React.Component {

    render() {
        const {data, style} = this.props;
        return (
            <div style={{
                ...TabStyle.container, ...style,
                // boxShadow: '10px 10px 5px #888888'
            }}>
                {data.map((item, index) => <TabItem key={index} item={item}/>)}
            </div>
        );
    }

}

TabView.propTypes = {
    data: PropTypes.array.isRequired,
    style: PropTypes.object,
};

const TabStyle = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: TabHeight,
        boxShadow: '0 -3px 5px rgba(136,136,136,0.33)'
    }
};


class MainTab extends React.Component {
    render() {
        const {
            focusColor,
            authenIcon,
            authenIconFocus,
            meIcon,
            meIconFocus,
            focusIndex = 0,
            onAuthenClick,
            onMeClick,
            qwstyle,
            style
        } = this.props;
        let width = '50%';
        let DefaultTabData = [
            {
                icon: authenIcon,
                iconFocus: authenIconFocus,
                focusColor,
                name: '认证',
                onClick: onAuthenClick,
                width
            },
            {
                icon: meIcon,
                iconFocus: meIconFocus,
                focusColor,
                name: '我的',
                onClick: onMeClick,
                width
            },
        ];
        DefaultTabData[focusIndex]['isFocus'] = true;
        return (
            <TabView data={DefaultTabData} style={style}/>
        );
    }
}

MainTab.propTypes = {
    style: PropTypes.object,
    focusColor: PropTypes.string.isRequired,
    authenIcon: PropTypes.string.isRequired,
    authenIconFocus: PropTypes.string.isRequired,
    meIcon: PropTypes.string.isRequired,
    meIconFocus: PropTypes.string.isRequired,
    focusIndex: PropTypes.number.isRequired,
    onAuthenClick: PropTypes.func,
    onMeClick: PropTypes.func,
};

export default MainTab;