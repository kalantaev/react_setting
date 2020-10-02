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
    getTypeByPath, ImageField, NumberField, Title, TYPES
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

class Index extends React.Component {

    state = {element: {}};

    componentWillMount() {
        if (this.props.match.params.id) {

            agent.Elements.get(this.props.match.params.id)
                .then(rs => {
                    this.setState({element: rs, title: rs.name})
                })
        } else {
            this.setState({
                element: {elementType: 'PLUMPING', inner: false, outer: false},
                title: getNameByPath(this.props.location.pathname)
            })
        }
    }

    submitForm() {
        if (this.state.element.id) {
            agent.Elements.save(this.state.element)
        } else {
            agent.Elements.saveNew(this.state.element)
                .then(el => {
                    window.location.href = '/' + el.elementType.toLowerCase() + '/' + el.id
                })
        }
    }

    changeField = (v, key) => {
        this.setState({element: {...this.state.element, [key]: v}})
    };

    setFile = (data, key) => {
        let file = data.target.files[0];
        if (file) {
            let formData = new FormData();
            formData.append('content', file);
            agent.Windows.saveFile(formData)
                .then(id => this.setState({element: {...this.state.element, [key]: id}}))
        }
    };

    deleteImg = (key) => {
        agent.Windows.deleteFile(this.state.element[key])
            .then(() => this.setState({element: {...this.state.element, [key]: undefined}}))
    };


    render() {
        if (!this.state.element) {
            return null;
        }
        let type = this.state.element.elementType;
        return (
            <MainView type={TYPES.PLUMPING} hideAdd={true} appName={this.state.title}>
                <hr className={'bold'}/>
                <form>
                    <div className={'custom-field'}>
                        {Field('Наименование отображаемое пользователю', 'name', this.state, this.changeField)}
                        <br/>
                        {NumberField('Ширина, мм', 'height', this.state, this.changeField)}
                        {NumberField('Длина, мм', 'length', this.state, this.changeField)}
                        {ImageField('Изображение для выбора', 'imageSelect', this.state, this.setFile, this.deleteImg)}
                        {ImageField('Изображение для отрисовки', 'image3D', this.state, this.setFile, this.deleteImg)}
                        {NumberField('Цена, руб', 'price', this.state, this.changeField)}
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
