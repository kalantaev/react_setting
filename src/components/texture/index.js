import React from 'react';
import agent from '../../agent';
import {connect} from 'react-redux';
import {ARTICLE_PAGE_LOADED, ARTICLE_PAGE_UNLOADED} from '../../constants/actionTypes';
import "../../styles.css"
import "../../style2.css"
import ConstructorJs from "../ConstructorJs";
import {image} from "../Image";
import {
    FeedTab, Field,
    getNameByPath,
    getNameByTag,
    getPathByTag,
    getPathByTagName,
    getTypeByPath, Title
} from "../../constants/function";

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

class Index extends React.Component {

    state = {needCreate: false, element: {bh: 2400, bw: 6000}};

    componentWillMount() {
        if (this.props.match.params.id) {
            agent.Windows.get(this.props.match.params.id)
                .then(rs => {
                    this.setState({element: {...rs, bh: 2400, bw: 6000}, title: rs.name})
                })
        } else {
            this.setState({
                element: {elementType: 'TEXTURE', inner: false, outer: false , bh: 2400, bw: 6000},
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
                    window.location.href = '/texture/' + el.id
                })
        }
    }

    changeField(v, key) {
        if (key === 'length'){
            if (parseInt(v)) {
                agent.Windows.deleteFile(this.state.element.imageSelect)
                this.setState({element: {...this.state.element, [key]: v, imageSelect: undefined}, needCreate: true})
            } else {
                this.setState({element: {...this.state.element, [key]: v}})
            }
        } else {
            this.setState({element: {...this.state.element, [key]: v}})
        }
    }

    setFile(data, key) {
        let file = data.target.files[0];
        if (file) {
            let formData = new FormData();
            formData.append('content', file);
            agent.Windows.saveFile(formData)
                .then(id => {
                    agent.Image.get(id).then(() => {
                        setTimeout(() => this.setState({needCreate: true}), 500)
                    })
                    this.setState({element: {...this.state.element, [key]: id}})
                })
        }
    }

    deleteImg(key) {
        agent.Windows.deleteFile(this.state.element[key])
            .then(() => {
                this.setState({element: {...this.state.element, image3D: undefined, imageSelect: undefined}},
                    () => {
                        if (this.state.element.id) {
                            this.submitForm()
                        }
                    }
                )
            })
    }

    updateTexture = (blob) => {
        let formData = new FormData();
        formData.append('content', blob);
        agent.Windows.saveFile(formData)
            .then(id => this.setState({element: {...this.state.element, imageSelect: id}}));
        this.setState({needCreate: false})
    };

    render() {
        if (!this.state.element) {
            return null;
        }
        let type = this.state.element.elementType;
        return (
            <div className="article-page">

                {Title(this.state)}

                <div className="container page">
                    {FeedTab(this.state, type)}
                    <form>
                        <fieldset>
                            {Field('Наименование отображаемое пользователю', 'name', this.state, this.changeField)}
                            <br/>

                            <fieldset className="form-group c-inline-block ">
                                <label className="c-label-small c-inline-block">Выберете изображение для
                                    заполнения</label>
                                {!this.state.element.image3D &&
                                <input className="col-xs-6 c-inline-block" id={'image3D'}
                                       type="file"
                                       onChange={(ev) => this.setFile(ev, 'image3D')}/>
                                }
                                {this.state.element.image3D &&
                                <div
                                    className={"col-xs-6 c-inline-block"}>
                                    {image(this.state.element.image3D, undefined, 150)}<br/>
                                    <span className={'delete-btn'}
                                          onClick={() => this.deleteImg('image3D')}>Удалить</span></div>
                                }

                            </fieldset>
                            <fieldset className="form-group c-inline-block">
                                <label className="c-label-small c-inline-block">Ширина элемента изображения, cм</label>
                                <input
                                    className="form-control form-control-lg  col-xs-6 c-inline-block"
                                    type="number"
                                    placeholder="Ширина элемента изображения"
                                    value={this.state.element.length}
                                    onChange={(ev) => this.changeField(ev.target.value, 'length')}/>
                            </fieldset>
                            <fieldset className="form-group c-inline-block">
                                <input type="checkbox" id="checkbox-1-1" checked={this.state.element.inner}
                                       onChange={() => this.changeField(!this.state.element.inner, 'inner')}
                                       className="regular-checkbox"/>
                                <label className={'margin-15'} htmlFor="checkbox-1-1"></label>
                                <label className="padding-left-20 margin-15 c-label-medium c-inline-block">Для напольного покрытия</label>
                            </fieldset>
                            <hr/>
                            <div className="btn btn-lg btn-primary pull-xs-right"
                                onClick={() => this.submitForm()}>
                                Сохранить
                            </div>
                        </fieldset>
                        <hr/>
                        <h5>Предпросмотр</h5>
                        <fieldset className="form-group c-inline-block">
                            <label className="c-label-small c-inline-block">Ширина бытовки, мм</label>
                            <input
                                className="form-control form-control-lg  col-xs-6 c-inline-block"
                                type="number"
                                placeholder="Ширина бытовки"
                                value={this.state.element.bw}
                                onChange={(ev) => this.changeField(ev.target.value, 'bw')}/>
                        </fieldset> <fieldset className="form-group c-inline-block">
                        <label className="c-label-small c-inline-block">Длина бытовки, мм</label>
                        <input
                            className="form-control form-control-lg  col-xs-6 c-inline-block"
                            type="number"
                            placeholder="Длина бытовки"
                            value={this.state.element.bh}
                            onChange={(ev) => this.changeField(ev.target.value, 'bh')}/>
                    </fieldset>
                    </form>


                    <div className="article-actions">
                    </div>
                    <ConstructorJs width={this.state.element.length}
                                   imageId={this.state.element.image3D}
                                   imageTexture={this.state.element.imageSelect}
                                   updateTexture={this.updateTexture}
                                   needCreate={this.state.needCreate}
                                   inner={this.state.element.inner}
                                   baseWidth={this.state.element.bw}
                                   baseHeight={this.state.element.bh}
                                   hideBtn={true}
                                   type={'TEXTURE'}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
