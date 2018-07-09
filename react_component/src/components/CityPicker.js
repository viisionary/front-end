import React from "react";
import {netGetAreaName} from "../service/Service";
import UserHelper from "../tools/UserHelper";
import PropTypes from "prop-types";
import Picker from "./Picker";

export default class CityPicker extends React.Component {


    constructor() {
        super();
        this.state = {
            province: [],
            value: {},
            city: [],
            area: [],
            placeholder: '请选择城市',
            showPicker: true
        };
        this.value = {};
        this.placeHolder = {};
    }

    static propTypes = {
        placeholder: PropTypes.string,
        left: PropTypes.element,
        style: PropTypes.object
    };

    componentWillMount() {
        UserHelper.getUser();
        netGetAreaName({...UserHelper.getUser()}).then(res => {
            this.setState({
                province: res,
            });
        });

    }

    render() {
        const {province, city, area, value, showPicker, placeholder, isShow, } = this.state;
        const {left, style, className, selectStyle, id, placeholderColor, onValueChange, onCancel,selectClassName} = this.props;
        return (
            <div className={className} style={{...SelectStyle.container, ...style}}>
                {left}
                <span style={selectStyle} className={selectClassName} onClick={() => {
                    this.setState({
                        showPicker: false
                    })
                }}> {placeholder} </span>
                <Picker
                    columns={[
                        {
                            values: province,
                            activeIndex: 0,
                            onItemSelected: (a, b) => {
                                let parent_id = b['key'];
                                this.value['province'] = b['key'];
                                this.placeHolder['a'] = b['value'];
                                netGetAreaName({...UserHelper.getUser(), parent_id}).then(res => {
                                    this.setState({
                                        city: res
                                    });
                                    if (res[0] && res[0].key) {
                                        netGetAreaName({...UserHelper.getUser(), parent_id: res[0].key}).then(ress => {
                                            this.setState({
                                                area: ress
                                            })
                                        });
                                    }
                                });
                            },
                        }, {
                            values: city,
                            activeIndex: 0,
                            onItemSelected: (a, b) => {
                                let parent_id = b['key'];
                                this.value['city'] = b['key'];
                                this.placeHolder['b'] = b['value'];
                                netGetAreaName({...UserHelper.getUser(), parent_id}).then(res => {
                                    this.setState({
                                        area: res
                                    })
                                });
                            }
                        }, {
                            values: area,
                            activeIndex: 0,
                            onItemSelected: (a, b) => {
                                this.value['town'] = b['key'];
                                this.placeHolder['c'] = b['value'];
                            }
                        }
                    ]}
                    onConfirm={(a, b) => {
                        this.setState({
                            placeholder: this.placeHolder ? this.placeHolder['a'] + this.placeHolder['b'] + this.placeHolder['c'] : '',
                            showPicker: true
                        });
                        onValueChange(this.value)
                    }}
                    shown={showPicker}
                    onCancel={() => {
                        this.setState({
                            showPicker: true
                        });
                    }}
                />
            </div>
        )
    }

}
const SelectStyle = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    select: {
        flexGrow: 1
    }
};