import {Link} from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import {connect} from 'react-redux';
import {
    UPDATE_FIELD_AUTH,
    LOGIN,
    LOGIN_PAGE_UNLOADED
} from '../constants/actionTypes';

class Login extends React.Component {

    state = {
        login: undefined, password: undefined, errors: []
    };

    submitForm = () => {
        let {login, password} = this.state;
        let errors = [];
        if (!login) {
            errors.push('Необходимо ввести логин')
        }
        if (!password) {
            errors.push('Необходимо ввести пароль')
        }
        this.setState({errors});
        if (errors.length === 0) {
            agent.Auth.login(login, password)
                .then((data) => {
                    window.location.href = '/';
                })
                .catch((errors) => {
                    this.setState(errors)
                })
        }
    };

    render() {
        let {login, password} = this.state;
        return (
            <div className="auth-page">
                <div className="container page">
                    <div className="row">
                        <div className="col-md-6 offset-md-3 col-xs-12">
                            <h1 className="text-xs-center">Авторизация</h1>
                            <ListErrors errors={this.state.errors}/>

                            <form>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input className="form-control form-control-lg"
                                               type="email" placeholder="Логин" value={login}
                                               onChange={ev => this.setState({login: ev.target.value})}/>
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <input className="form-control form-control-lg"
                                               type="password" placeholder="Пароль" value={password}
                                               onChange={ev => this.setState({password: ev.target.value})}/>
                                    </fieldset>
                                    <div className="btn btn-lg btn-primary pull-xs-right"
                                         type="submit" onClick={this.submitForm}> Войти
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
