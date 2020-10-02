import agent from '../agent';
import Header from './Header';
import React from 'react';
import { connect } from 'react-redux';
import { APP_LOAD, REDIRECT } from '../constants/actionTypes';
import {Link, Route, Switch} from 'react-router-dom';
import WindowEl from '../components/WindowEl';
import Door from './ListElement';
import Editor from '../components/Editor';
import Home from '../components/Home';
import Login from '../components/Login';
import Profile from '../components/Profile';
import ProfileFavorites from '../components/ProfileFavorites';
import Register from '../components/Register';
import Settings from '../components/Settings';
import { store } from '../store';
import { push } from 'react-router-redux';
import Banner from "./Home/Banner";
import MenuItem from "./Home/MenuItem";
import {getPathByTagName, menuItems} from "../constants/function";
import MainView from "./Home/MainView";

const mapStateToProps = state => {
    return {
        appLoaded: state.common.appLoaded,
        appName: state.common.appName,
        currentUser: state.common.currentUser,
        redirectTo: state.common.redirectTo
    }};

const mapDispatchToProps = dispatch => ({
    onLoad: (payload, token) =>
        dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
    onRedirect: () =>
        dispatch({ type: REDIRECT })
});

class AddNew extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.redirectTo) {
            // this.context.router.replace(nextProps.redirectTo);
            store.dispatch(push(nextProps.redirectTo));
            this.props.onRedirect();
        }
    }

    componentWillMount() {
        const token = window.localStorage.getItem('jwt');
        if (token) {
            agent.setToken(token);
        }

        this.props.onLoad( token);
    }

    render() {
      return  <div className="home-page">

            <Banner token={this.props.token} appName={this.props.appName}/>

            <div className="container page">
                <div className="row">
                    <div className="col-md-3">
                        <div className="sidebar">
                            <p>Меню</p>
                            <MenuItem tags={menuItems}/>
                        </div>
                    </div>
                    <div className="col-md-9">
                    <Link className="tag-default tag-pill" to={'/new/base'}>Добавить базовую комплектацию</Link>
                    <br/>
                    <Link className="tag-default tag-pill" to={'/new/window'}>Добавить окно</Link>
                        <br/>
                        <Link className="tag-default tag-pill" to={'/new/door'}>Добавить дверь</Link>
                        <br/>
                        <Link className="tag-default tag-pill" to={'/new/electro'}>Добавить электроприбор</Link>
                        <br/>
                        <Link className="tag-default tag-pill" to={'/new/texture'}>Добавить текстуру</Link>
                    </div>
                </div>
            </div>

        </div>
    }
}

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(AddNew);
