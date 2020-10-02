import React from 'react';
import agent from '../../agent';
import {connect} from 'react-redux';
import {ARTICLE_PAGE_LOADED, ARTICLE_PAGE_UNLOADED} from '../../constants/actionTypes';
import "../../styles.css"
import "../../style2.css"
import ConstructorJs from "../ConstructorJs";
import {render} from "redux-logger/src/diff";
import {image} from "../Image";
import {
    FeedTab, Field,
    getNameByPath,
    getNameByTag,
    getPathByTag,
    getPathByTagName,
    getTypeByPath,
    Title, TYPES
} from "../../constants/function";
import MainView from "../Home/MainView";


const mapStateToProps = state => ({
    ...state.article,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({type: ARTICLE_PAGE_LOADED, payload}),
    onUnload: () =>
        dispatch({type: ARTICLE_PAGE_UNLOADED})
});

class WindowEl extends React.Component {

    state = {needCreate: false};

    componentWillMount() {
        if (this.props.match.params.id) {
            agent.Windows.get(this.props.match.params.id)
                .then(rs => {
                    this.setState({element: rs, title: rs.name})
                })
        } else {
            this.setState({
                element: {elementType: getTypeByPath(this.props.location.pathname), inner: false, outer: false},
                title: getNameByPath(this.props.location.pathname)
            })
        }
    }

    componentWillUnmount() {
        // this.props.onUnload();
    }

    submitForm() {
        if (this.state.element.id) {
            agent.Windows.save(this.state.element)
        } else {
            agent.Windows.saveNew(this.state.element)
                .then(el => {
                    window.location.href = getPathByTag(el.elementType) + el.id
                })
        }
    }

    changeField(v, key) {
        this.setState({element: {...this.state.element, [key]: v}})
    }

    setFile(data, key) {
        let file = data.target.files[0];
        if (file) {
            let formData = new FormData();
            formData.append('content', file);
            agent.Windows.saveFile(formData)
                .then(id => this.setState({element: {...this.state.element, [key]: id}}))
        }
    }

    deleteImg(key) {
        agent.Windows.deleteFile(this.state.element[key])
            .then(() => this.setState({element: {...this.state.element, [key]: undefined}}))
    }

    render() {
        if (!this.state.element) {
            return null;
        }
        let type = this.state.element.elementType;
        const email = this.props.email;
        const password = this.props.password;
        return (
            <div><MainView type={TYPES.WINDOW} hideAdd={true} appName={this.state.title}>
                <form>
                    <div className={'custom-field'}>
                        {Field('Наименование отображаемое пользователю', 'name', this.state, this.changeField)}
                        <div className={"c-fool-width"}>
                            <fieldset className="form-group c-inline-block">
                                <label className="c-label-small c-inline-block">Ширина, мм</label>
                                <input
                                    className="form-control form-control-lg  col-xs-6 c-inline-block"
                                    type="number"
                                    placeholder="Ширина"
                                    value={this.state.element.length}
                                    onChange={(ev) => this.changeField(ev.target.value, 'length')}/>
                            </fieldset>
                            <fieldset className="form-group c-inline-block ">
                                <label className="c-label-small c-inline-block">Высота, мм</label>
                                <input
                                    className="form-control form-control-lg  col-xs-6 c-inline-block"
                                    type="number"
                                    placeholder="Высота"
                                    value={this.state.element.height}
                                    onChange={(ev) => this.changeField(ev.target.value, 'height')}/>
                            </fieldset>
                        </div>
                        <fieldset className="form-group c-inline-block ">
                            <label className="c-label-small c-inline-block">Цена, руб</label>
                            <input
                                className="form-control form-control-lg  col-xs-6 c-inline-block"
                                type="number"
                                placeholder="Цена"
                                value={this.state.element.price}
                                onChange={(ev) => this.changeField(ev.target.value, 'price')}/>
                        </fieldset>
                        <fieldset className="form-group c-inline-block ">
                            <label className="c-label-small c-inline-block">Высота расположения верхней линии</label>
                            <input
                                className="form-control form-control-lg  col-xs-6 c-inline-block"
                                type="number"
                                placeholder="Высота расположения верхней линии"
                                value={this.state.element.heightPosition}
                                onChange={(ev) => this.changeField(ev.target.value, 'heightPosition')}/>
                        </fieldset>
                        {type === 'DOOR' && <div className="form-inline">
                            <fieldset className="form-group c-inline-block">
                                <input type="checkbox" id="checkbox-1-1" checked={this.state.element.outer}
                                       onChange={() => this.changeField(!this.state.element.outer, 'outer')}
                                       className="regular-checkbox"/>
                                <label className={'margin-15'} htmlFor="checkbox-1-1"></label>
                                <label className="padding-left-20 margin-15 c-label-medium c-inline-block">Может
                                    быть входной</label>
                            </fieldset>
                            <fieldset className="form-group c-inline-block ">
                                <input type="checkbox" id="checkbox-1-2" checked={this.state.element.inner}
                                       onChange={() => this.changeField(!this.state.element.inner, 'inner')}
                                       className="regular-checkbox"/>
                                <label className={'margin-15'} htmlFor="checkbox-1-2"></label>
                                <label className="padding-left-20 c-inline-block">Может быть межкомнатной</label>
                            </fieldset>
                        </div>}
                        <br/>

                        <fieldset className="form-group c-inline-block ">
                            <label className="c-label-small c-inline-block">Изображение для выбора</label>
                            {!this.state.element.imageSelect &&
                            <input className="col-xs-6 c-inline-block" id={'imageSelect'}
                                   type="file"
                                   onChange={(ev) => this.setFile(ev, 'imageSelect')}/>}
                            {this.state.element.imageSelect &&
                            <div className={"col-xs-6 c-inline-block"}>{image(this.state.element.imageSelect, 150)}
                                <br/><span className={'delete-btn'}
                                           onClick={() => this.deleteImg('imageSelect')}>Удалить</span></div>}
                        </fieldset>

                        <fieldset className="form-group c-inline-block ">
                            <label className="c-label-small c-inline-block">Изображение на 3D модели</label>
                            {!this.state.element.image3D &&
                            <input className="col-xs-6 c-inline-block" id={'image3D'}
                                   type="file"
                                   onChange={(ev) => this.setFile(ev, 'image3D')}/>
                            }
                            {this.state.element.image3D &&
                            <div
                                className={"col-xs-6 c-inline-block"}>
                                {image(this.state.element.image3D, 150)}<br/>
                                <span className={'delete-btn'}
                                      onClick={() => this.deleteImg('image3D')}>Удалить</span></div>
                            }
                        </fieldset>
                        <hr/>
                        <div
                            className="btn btn-lg btn-primary"
                            onClick={() => this.submitForm()}>
                            Сохранить
                        </div>

                    </div>
                </form>
            </MainView>
                {/*<div className="article-page">*/}
                {/*    <div className="container page">*/}
                {/*<div className="article-actions">*/}
                {/*</div>*/}
                {/*<ConstructorJs width={this.state.element.length}*/}
                {/*               height={this.state.element.height}*/}
                {/*               imageId={this.state.element.image3D}*/}
                {/*               type={type}*/}
                {/*/></div></div>*/}
            </div>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WindowEl);
