import MainView from '../Home/MainView';
import React from 'react';
import agent from '../../agent';
import {connect} from 'react-redux';
import {
    HOME_PAGE_LOADED,
    HOME_PAGE_UNLOADED
} from '../../constants/actionTypes';
import Table from "../table/Table";
import {TYPES} from "../../constants/function";

const mapStateToProps = state => ({
    ...state.home,
    appName: state.common.appName,
    token: state.common.token
});

const mapDispatchToProps = dispatch => ({
    onLoad: (tab, pager, payload) =>
        dispatch({type: HOME_PAGE_LOADED, tab, pager, payload}),
    onUnload: () =>
        dispatch({type: HOME_PAGE_UNLOADED})
});

const baseConfigKeySet = [
    {key: 'name', value: 'Наименование'},
    {key: 'priority', value: 'Порядок отображения'},
    {key: 'width', value: 'Длина, мм'},
    {key: 'height', value: 'Ширина, мм'},
    {key: 'price', value: 'Цена, руб'},
    {key: 'action', value: ''}];

class BaseConfig extends React.Component {
    state = {elements: [], loading: true};

    componentWillMount() {
        console.info(1)
        agent.BaseConfig.all().then(rs => {
            console.info(2, rs)
            this.setState({
                loading: false,
                elements: rs.map(i => ({
                    ...i,
                    elementType: TYPES.BASE_CONFIG
                }))
            })
        }).catch(console.info)
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    updateElement = (id) => {
        agent.BaseConfig.changePostedBaseConfig(id)
            .then(() => {
                let el = this.state.elements;
                el.forEach(item => {
                    if (item.id === id) {
                        item.posted = !item.posted;
                    }
                });
                this.setState({elements: el})
            })
    };

    actionLblFn = (el) => {
        return el.posted ? 'Скрыть' : 'Отображать';
    };

    render() {
        return (
            <MainView type={TYPES.BASE_CONFIG} token={this.props.token}
                      appName={this.props.appName}>
                <Table loading={this.state.loading} elements={this.state.elements} actionBtn={this.updateElement}
                       actionLblFn={this.actionLblFn} keySet={baseConfigKeySet}/>
            </MainView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseConfig);
