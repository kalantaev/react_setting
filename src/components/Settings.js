import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import {connect} from 'react-redux';
import {
    SETTINGS_SAVED,
    SETTINGS_PAGE_UNLOADED,
    LOGOUT
} from '../constants/actionTypes';
import MainView from "./Home/MainView";

class Settings extends React.Component {

    state = {settings: []};

    componentDidMount() {
        agent.Settings.all()
            .then(rs => this.setState({settings: rs}))
    }

    updateState = (v, k) => {
        let setting = this.state.settings;
        let current = setting.filter(item => item.key === k)[0];
        current.value = v;
        this.setState({settings: setting})
    }

    submitForm = () => {
        agent.Settings.save(this.state.settings)
    }

    render() {

        return (
            <MainView type={this.state.type} token={this.props.token} hideAdd={true}
                      appName={"Настройки приложения"}>

                            <h1 className="text-xs-center"></h1>
                            {this.state.settings.map(item => {
                                return <div key={item.key}>
                                    <fieldset key={'fs' + item.key} className="form-group">
                                        <label key={'l' + item.key}
                                               className=" c-inline-block">{item.description}</label>
                                        <input
                                            key={'i' + item.key}
                                            className="form-control  col-xs-19  c-inline-block"
                                            placeholder={item.description}
                                            value={item.value}
                                            onChange={(ev) => this.updateState(ev.target.value, item.key)}/>
                                    </fieldset>
                                </div>
                            })}

                            <hr/>
                            <div
                                className="btn btn-lg btn-primary pull-xs-right"
                                onClick={() => this.submitForm()}>
                                Сохранить
                            </div>

            </MainView>
        );
    }
}

export default (Settings);
