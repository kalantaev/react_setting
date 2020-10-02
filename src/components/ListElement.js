import MainView from './Home/MainView';
import React from 'react';
import agent from '../agent';
import {connect} from 'react-redux';
import {
    HOME_PAGE_LOADED,
    HOME_PAGE_UNLOADED
} from '../constants/actionTypes';

import Table from "./table/Table";
import {getKeySet, getTypeByPath} from "../constants/function";


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

class ListElement extends React.Component {
    state = {elements: [], type: getTypeByPath(this.props.location.pathname), loading: true};

    componentWillMount() {
        this.init()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let path = this.props.location.pathname;
        if (path !== this.state.path) {
            this.init()
        }
    }

    init = () => {
        let path = this.props.location.pathname;
        let type = getTypeByPath(path);
        this.setState({elements: [], type: type, loading: true, path: path});
        agent.Elements.all(type).then(rs => this.setState({
            path: path,
            loading: false,
            keySet: getKeySet(path),
            elements: rs
        })).catch(console.info)
    }


    render() {
        return (
            <MainView type={this.state.type} token={this.props.token}
                      appName={this.props.appName}>
                <Table loading={this.state.loading} elements={this.state.elements} keySet={this.state.keySet}/>
            </MainView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListElement);
