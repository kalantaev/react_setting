import React from 'react';
import agent from '../../agent';
import {connect} from 'react-redux';
import {ARTICLE_PAGE_LOADED, ARTICLE_PAGE_UNLOADED} from '../../constants/actionTypes';
import "../../styles.css"
import "../../style2.css"
import Select from 'react-select';
import {image} from "../Image";
import {
    FeedTab, Field,
    getNameByPath,
    getNameByTag,
    getPathByTag,
    getPathByTagName,
    getTypeByPath, Title, TYPES
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

const options = [
    {value: 'LIGHT', label: 'Источник освещения'},
    {value: 'SOCKET', label: 'Электрическая розетка'}
];

const optionsSocketType = [
    {value: 'SINGLE', label: 'Одинарная'},
    {value: 'DOUBLE', label: 'Двойная'}
];
const optionsSocketGrounding = [
    {value: 'WITHOUT', label: 'Без заземления'},
    {value: 'WITH', label: 'С заземлением'}
];

class Index extends React.Component {

    state = {element: {}};

    componentWillMount() {
        if (this.props.match.params.id) {
            agent.Windows.get(this.props.match.params.id)
                .then(rs => {
                    this.setState({element: this.deserializeData(rs), title: rs.name})
                })
        } else {
            this.setState({
                element: {elementType: {value: 'LIGHT', label: 'Источник освещения'}, inner: false, outer: false},
                title: getNameByPath(this.props.location.pathname)
            })
        }
    }

    submitForm() {
        let data = this.serializeData();
        if (this.state.element.id) {
            agent.Windows.save(data)
        } else {
            agent.Windows.saveNew(data)
                .then(el => {
                    window.location.href = '/' + data.elementType.toLowerCase() + '/' + el.id
                })
        }
    }

    serializeData = () => {
        return {
            ...this.state.element,
            elementType: this.state.element.elementType.value,
            single: this.state.element.elementType.value === 'SOCKET' && this.state.element.socketType.value === 'SINGLE',
            grounding: this.state.element.elementType.value === 'SOCKET' &&  this.state.element.socketGrounding.value === 'WITH'
        }
    };
    deserializeData = (data) => {
        let elementType = options.filter(i => i.value === data.elementType)[0];
        return {
            ...data,
            elementType: elementType,
            socketType: optionsSocketType.filter(i => i.value === (data.single ? 'SINGLE' : 'DOUBLE'))[0],
            socketGrounding: optionsSocketGrounding.filter(i => i.value === (data.grounding ? 'WITH' : 'WITHOUT'))[0],
        }
    };

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

    changeElementType(v, field) {
        if (field === 'elementType' && v.value === 'SOCKET') {
            let socketType = !this.state.element.socketType ? {
                value: 'SINGLE',
                label: 'Одинарная'
            } : this.state.element.socketType;
            let socketGrounding = !this.state.element.socketGrounding ? {
                value: 'WITHOUT',
                label: 'Без заземления'
            } : this.state.element.socketGrounding;
            this.setState({element: {...this.state.element, [field]: v, socketType, socketGrounding}})
        } else {
            this.setState({element: {...this.state.element, [field]: v}})
        }
    }

    render() {
        if (!this.state.element) {
            return null;
        }
        let type = this.state.element.elementType;
        return (
            <MainView type={this.state.element.elementType} hideAdd={true} appName={this.state.title}>
                <hr className={'bold'}/>
                <form>
                    <div className={'custom-field'}>
                            {Field('Наименование отображаемое пользователю', 'name', this.state, this.changeField)}
                            <br/>
                            <fieldset className="form-group">
                                <div className="width-500 col-xs-3 c-inline-block">Тип электрической точки</div>
                                <Select className="width-500 col-xs-6 c-inline-block"
                                        value={this.state.element.elementType}
                                        onChange={(ev) => this.changeElementType(ev, 'elementType')}
                                        options={options}
                                />
                            </fieldset>
                            {this.state.element && this.state.element.elementType && this.state.element.elementType.value === 'SOCKET' && <div>
                                <br/>
                                <fieldset className="form-group">
                                    <div className="width-500 col-xs-3 c-inline-block">Вид розетки</div>
                                    <Select className="width-500 col-xs-6 c-inline-block"
                                            value={this.state.element.socketType}
                                            onChange={(ev) => this.changeElementType(ev, 'socketType')}
                                            options={optionsSocketType}/></fieldset>
                                <br/>
                                <fieldset className="form-group">
                                    <div className="width-500 col-xs-3 c-inline-block">Заземление</div>
                                    <Select className="width-500 col-xs-6 c-inline-block"
                                            value={this.state.element.socketGrounding}
                                            onChange={(ev) => this.changeElementType(ev, 'socketGrounding')}
                                            options={optionsSocketGrounding}/></fieldset>
                            </div>}
                            <fieldset className="form-group c-inline-block ">
                                <label className="c-label-small c-inline-block">Изображение для выбора</label>
                                {!this.state.element.imageSelect &&
                                <input className="col-xs-6 c-inline-block" id={'imageSelect'}
                                       type="file"
                                       onChange={(ev) => this.setFile(ev, 'imageSelect')}/>
                                }
                                {this.state.element.imageSelect &&
                                <div className={"col-xs-6 c-inline-block"}>
                                    {image(this.state.element.imageSelect, undefined, 150)}<br/>
                                    <span className={'delete-btn'}
                                          onClick={() => this.deleteImg('imageSelect')}>Удалить</span></div>
                                }

                            </fieldset>
                            <fieldset className="form-group c-inline-block ">
                                <label className="c-label-small c-inline-block">Цена, руб</label>
                                <input
                                    className="form-control form-control-lg  col-xs-6 c-inline-block"
                                    type="number"
                                    placeholder="Цена"
                                    value={this.state.element.price}
                                    onChange={(ev) => this.changeField(ev.target.value, 'price')}/>
                            </fieldset>
                            <hr/>
                            <div className="btn btn-lg btn-primary pull-xs-right"
                                 onClick={() => this.submitForm()}>
                                Сохранить
                            </div>
                    </div>
                    </form>
            </MainView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
