import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import MenuItem from './MenuItem';
import agent from '../../agent';
import {connect} from 'react-redux';
import {
    HOME_PAGE_LOADED,
    SET_MENU_ITEM,
    HOME_PAGE_UNLOADED,
    APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import {menuItems} from "../../constants/function";

const Promise = global.Promise;

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

class Home extends React.Component {
    componentWillMount() {
        const tab = this.props.token ? 'feed' : 'all';
        const windowsPromise = agent.Windows.all;
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        return (
            <div className="home-page">

                <Banner token={this.props.token} appName={this.props.appName}/>

                <div className="container page">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="sidebar">
                                <p>Меню</p>
                                <MenuItem tags={menuItems}/>
                            </div>
                        </div>
                        <MainView/>
                    </div>
                </div>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
