import React from 'react';
import Select from "react-select";
import {image} from "../components/Image";

export const tags = {DOOR: 'Настройка дверей', WINDOW: 'Настройка окон'};

export const menuItems = [
    "Базовые комплектации", 'Настройка окон', 'Настройка дверей',
    "Настройка текстур", 'Электрические точки', "Сантехника", 'Настройка приложения'];

const windowKeySet = [
    {key: 'image', value: ''},
    {key: 'name', value: 'Наименование'},
    {key: 'length', value: 'Ширина, мм'},
    {key: 'height', value: 'Высота, мм'},
    {key: 'price', value: 'Цена, руб'}];

const doorKeySet = [
    {key: 'image', value: ''},
    {key: 'name', value: 'Наименование'},
    {key: 'length', value: 'Ширина, мм'},
    {key: 'height', value: 'Высота, мм'},
    {key: 'price', value: 'Цена, руб'}];

export const textureKeySet = [
    {key: 'image', value: ''},
    {key: 'name', value: 'Наименование'},
    {key: 'inner', value: 'Напольное покрытие'}];

const electroKeySet = [
    {key: 'image', value: ''},
    {key: 'name', value: 'Наименование'},
    {key: 'price', value: 'Цена, руб'}];
const plumbingKeySet = [
    {key: 'image', value: ''},
    {key: 'name', value: 'Наименование'},
    {key: 'price', value: 'Цена, руб'}];

const baseConfigKeySet = [
    {key: 'name', value: 'Наименование'},
    {key: 'width', value: 'Длина, мм'},
    {key: 'priority', value: 'Порядок отображения'},
    {key: 'height', value: 'Ширина, мм'},
    {key: 'price', value: 'Цена, руб'},
    {key: 'action', value: ''}];

export const PATH = {
    WINDOWS: '/windows',
    DOORS: '/doors',
    ELECTROS: '/electro',
    PLUMPINGS: '/plumpings',
    TEXTURES: '/textures',
    BASE_CONFIGS: '/base-configuration'
};

export const TYPES = {
    DOOR: 'DOOR',
    WINDOW: 'WINDOW',
    TEXTURE: 'TEXTURE',
    PLUMPING: 'PLUMPING',
    ELECTRO: 'ELECTRO',
    BASE_CONFIG: 'BASE-CONFIG'
};

export const getKeySet = (path) => {
    switch (path) {
        case PATH.WINDOWS:
            return windowKeySet;
        case PATH.DOORS:
            return doorKeySet;
        case PATH.TEXTURES:
            return textureKeySet;
        case PATH.BASE_CONFIGS:
            return baseConfigKeySet;
        case PATH.ELECTROS:
            return electroKeySet;
        case PATH.PLUMPINGS:
            return plumbingKeySet;
    }
}

export const getTypeByPath = tagName => {
    switch (tagName) {
        case '/new/window':
            return 'WINDOW';
        case '/new/door':
            return 'DOOR';
        case PATH.DOORS:
            return TYPES.DOOR;
        case PATH.WINDOWS:
            return TYPES.WINDOW;
        case PATH.BASE_CONFIGS:
            return TYPES.BASE_CONFIG;
        case PATH.TEXTURES:
            return TYPES.TEXTURE;
        case PATH.ELECTROS:
            return TYPES.ELECTRO;
        case PATH.PLUMPINGS:
            return TYPES.PLUMPING;
        default:
            return '/windows';
    }
};


export const getPathByTagName = tagName => {
    switch (tagName) {
        case 'Настройка окон':
            return PATH.WINDOWS;
        case 'Настройка дверей':
            return '/doors';
        case 'Добавить новый элемент':
            return '/new';
        case 'Настройка текстур':
            return PATH.TEXTURES;
        case 'Настройка приложения':
            return '/settings';
        case 'Электрические точки':
            return PATH.ELECTROS;
        case 'Сантехника':
            return PATH.PLUMPINGS;
        case 'Базовые комплектации':
            return PATH.BASE_CONFIGS;
        default:
            return '/windows';
    }
};

export const getPathByTag = tagName => {
    switch (tagName) {
        case TYPES.WINDOW:
            return '/window/';
        case TYPES.DOOR:
            return '/door/';
        case 'Добавить новый элемент':
            return '/new';
        default:
            return '/windows';
    }
};

export const getPathNewByPath = tagName => {
    switch (tagName) {
        case '/':
            return '/new/base';
        case '/base-configuration':
            return '/new/base';
        case '/windows':
            return '/new/window';
        case '/electro':
            return '/new/electro';
        case '/doors':
            return '/new/door';
        case '/textures':
            return '/new/texture';
        default:
            return '/new' + tagName;
    }
};

export const getNameByPath = tagName => {
    switch (tagName) {
        case '/new/base':
            return 'Новая базовая комплектация';
        case '/new/window':
            return 'Новое окно';
        case '/new/electro':
            return 'Новая электрическая точка';
        case '/new/door':
            return 'Новая дверь';
        case '/new/texture':
            return 'Сантехника';
        case 'new/plumpings':
            return 'Новая текстура';
        default:
            return '/windows';
    }
};

export const getNameByTag = (tag) => tags[tag];

export const Title = (state) => <div className="banner">
    <div className="container">
        <h1>{state.title}</h1>
    </div>
</div>;


const GlobalFeedTab = props => {
    return (
        <li className="nav-item">
            <a href="/" className={!props.type ? 'nav-link active' : 'nav-link'}>Главная</a>
        </li>
    );
};


const TagFilterTab = props => {
    if (!props.tag) {
        return null;
    }

    return (
        <li className="nav-item">
            <a href={getPathByTagName(getNameByTag(props.tag))} className="nav-link">
                {getNameByTag(props.tag)}
            </a>
        </li>
    );
};

const CurrentTab = props => {
    return (
        <li className="nav-item">
            <div className="nav-link active">
                <i className="ion-pound"/> {props.name}
            </div>
        </li>
    );
};


export const FeedTab = (state, type) => <div className="feed-toggle">
    <ul className="nav nav-pills outline-active">
        <GlobalFeedTab type={type}/>
        <TagFilterTab tag={type}/>
        <CurrentTab name={state.title}/>
    </ul>
</div>;

export const Field = (label, field, state, onChange) => <div className="form-group">
    <label>{label}</label>
    <input
        className="form-control form-control-lg"
        type="text"
        placeholder={label}
        value={state.element[field]}
        onChange={(ev) => onChange(ev.target.value, field)}/>
</div>;

export const Field2 = (label, field, state, onChange) => <fieldset className="form-group c-inline-block">
    <label className="c-label-small c-inline-block">{label}</label>
    <input
        className="form-control form-control-lg  col-xs-6 c-inline-block"
        type='number'
        placeholder={label}
        value={state.element[field]}
        onChange={(ev) => onChange(ev.target.value, field)}/>
</fieldset>;
export const FieldText = (label, field, state, onChange) => <fieldset className="form-group c-inline-block">
    <label className="c-label-small c-inline-block">{label}</label>
    <input
        className="form-control form-control-lg  col-xs-6 c-inline-block"
        type='text'
        placeholder={label}
        value={state.element[field]}
        onChange={(ev) => onChange(ev.target.value, field)}/>
</fieldset>;

export const ImageField = (label, field, state, setFile, deleteImg) => <fieldset className="form-group c-inline-block ">
    <label className="c-label-small c-inline-block">{label}</label>
    {!state.element[field] &&
    <input className="col-xs-6 c-inline-block" id={field}
           type="file"
           onChange={(ev) => setFile(ev, field)}/>
    }
    {state.element[field] &&
    <div className={"col-xs-6 c-inline-block"}>
        {image(state.element[field], undefined, 150)}<br/>
        <span className={'delete-btn'}
              onClick={() => deleteImg(field)}>Удалить</span></div>
    }
</fieldset>;

export const NumberField = (label, field, state, onChange) => <fieldset className="form-group c-inline-block ">
    <label className="c-label-small c-inline-block">{label}</label>
    <input
        className="form-control form-control-lg  col-xs-6 c-inline-block"
        type="number"
        placeholder={label}
        value={state.element[field]}
        onChange={(ev) => onChange(ev.target.value, field)}/>
</fieldset>;




