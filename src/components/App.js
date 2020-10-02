import agent from '../agent';
import Header from './Header';
import React from 'react';
import { connect } from 'react-redux';
import { APP_LOAD, REDIRECT } from '../constants/actionTypes';
import { Route, Switch } from 'react-router-dom';
import WindowEl from '../components/WindowEl';
import ElectroEl from '../components/electroEl';
import Texture from '../components/texture';
import ListElement from './ListElement';
import Editor from '../components/Editor';
import Login from '../components/Login';
import Profile from '../components/Profile';
import ProfileFavorites from '../components/ProfileFavorites';
import Register from '../components/Register';
import Settings from '../components/Settings';
import { store } from '../store';
import { push } from 'react-router-redux';
import AddNew from "./AddNew";
import BaseConfig from "./base-config/BaseConfig";
import Config from "./base-config/Config";
import Updates from "./updates/Updates";
import PlunpingEl from "./plumping";
import {PATH} from "../constants/function";

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

class App extends React.Component {
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

    this.props.onLoad(null);
  }

  render() {
    if (this.props.appLoaded) {
      return (
        <div>
          <Header
            appName={this.props.appName}
            currentUser={this.props.currentUser} />
            <Switch>
            <Route exact path="/" component={BaseConfig}/>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/editor/:slug" component={Editor} />
            <Route path="/editor" component={Editor} />
            <Route path="/updates" component={Updates} />
            <Route path="/window/:id" component={WindowEl} />
            <Route path="/new/window" component={WindowEl} />
            <Route path="/new/door" component={WindowEl} />
            <Route path="/new/base" component={Config} />
            <Route path="/door/:id" component={WindowEl} />
            <Route path="/base-config/:id" component={Config} />
            <Route path={PATH.DOORS} component={ListElement} />
            <Route path={PATH.ELECTROS} component={ListElement} />
            <Route path={PATH.PLUMPINGS} component={ListElement} />
            <Route path="/new/plumpings" component={PlunpingEl} />
            <Route path="/plumping/:id" component={PlunpingEl} />
            <Route path="/light/:id" component={ElectroEl} />
            <Route path="/socket/:id" component={ElectroEl} />
            <Route path="/new/electro" component={ElectroEl} />
            <Route path={PATH.TEXTURES} component={ListElement} />
            <Route path="/texture/:id" component={Texture} />
            <Route path="/new/texture" component={Texture} />
            <Route path={PATH.WINDOWS} component={ListElement}/>
            <Route path={PATH.BASE_CONFIGS} component={BaseConfig} />
            <Route path="/settings" component={Settings} />
            <Route path="/new" component={AddNew} />
            <Route path="/@:username/favorites" component={ProfileFavorites} />
            <Route path="/@:username" component={Profile} />
            </Switch>
        </div>
      );
    }
    return (
      <div>
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser} />
      </div>
    );
  }
}

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(App);
