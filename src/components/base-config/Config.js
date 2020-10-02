import React from 'react';
import agent from '../../agent';
import {connect} from 'react-redux';
import {ARTICLE_PAGE_LOADED, ARTICLE_PAGE_UNLOADED} from '../../constants/actionTypes';
import "../../styles.css"
import "../../style2.css"
import Select from 'react-select';
import {
    FeedTab, Field, Field2, FieldText,
    getNameByPath,
    getNameByTag,
    getPathByTagName, textureKeySet, Title, TYPES
} from "../../constants/function";
import MainView from "../Home/MainView";
import Table from "../table/Table";
import AccordionComponent from "../Accordion/Accordion";

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
    {value: 'TOP', label: 'Сзади'},
    {value: 'BOTTOM', label: 'Спереди'},
    {value: 'LEFT', label: 'Слева'},
    {value: 'RIGHT', label: 'Справа'},
];


export const textureKeySetSelected = (actionSelect) => [
    {
        key: 'select', value: '', data: (i, index) => <div key={'4-add' + index} className={' c-inline-block'}>
            <input key={ index} type="checkbox" id={"checkbox-add-1-2" + index}
                   checked={i.selected}
                   onChange={() => actionSelect(i.id)}
                   className="regular-checkbox"/>
            <label key={'5-add' + index} className={'margin-15  c-inline-block'}
                   htmlFor={"checkbox-add-1-2" + index}></label>
        </div>
    },
    {key: 'image', value: ''},
    {key: 'name', value: 'Наименование'},
    {key: 'inner', value: 'Напольное покрытие'}];

export const windowKeySetSelected = (actionSelect) => [
    {
        key: 'select', value: '', data: (i, index) => <div key={'4-add' + index} className={' c-inline-block'}>
            <input key={ index} type="checkbox" id={"checkbox-add-1-2" + index}
                   checked={i.selected}
                   onChange={() => actionSelect(i.id)}
                   className="regular-checkbox"/>
            <label key={'5-add' + index} className={'margin-15  c-inline-block'}
                   htmlFor={"checkbox-add-1-2" + index}></label>
        </div>
    },
    {key: 'image', value: ''},
    {key: 'name', value: 'Наименование'},
    {key: 'length', value: 'Ширина, мм'},
    {key: 'height', value: 'Высота, мм'}];

const bcwKeySet = (actionDlt, actionChange) => [
    {key: 'image', value: '', path: ['element', 'imageSelect']},
    {key: 'name', value: 'Наименование', path: ['element', 'name']},
    {
        key: 'position', value: 'Расположение', data: (i, index) => <Select
            className=""
            value={i.position}
            onChange={(ev) => actionChange(ev, index, 'position')}
            options={options}
        />
    },
    {
        key: 'height', value: 'Отступ, %', data: (i, index) => <input
            className="form-control max-100"
            key={'pw' + index}
            type="number"
            value={i.shift}
            onChange={(ev) => actionChange(ev.target.value, index, 'shift')}/>
    },
    {key: 'delete', value: '', onClick: actionDlt, actionKey: 'Удалить'}];

const bcWallKeySet = (actionDlt, actionChange) => [
    {key: 'description', size: 50, value: 'Наименование, отображаемое пользователю', data: (i, index) => <input
            key={'n' + index}
            className="form-control custom-input"
            type="text"
            placeholder="Наименование"
            value={i.description}
            onChange={(ev) => actionChange(ev.target.value, index, 'description')}/> },
    {
        key: 'depth', value: 'Толщина', data: (i, index) => <input
            key={'de' + index}
            className="form-control  max-70 custom-input"
            type="number"
            placeholder="Толщина"
            value={i.depth}
            onChange={(ev) => actionChange(ev.target.value, index, 'depth')}/>
    },
    {
        key: 'height', value: 'Доп.цена', data: (i, index) => !i.def && <input
            className="form-control  max-85 custom-input"
            key={'p' + index}
            type="number"
            placeholder="Дополнительная цена"
            value={i.price}
            onChange={(ev) => actionChange(ev.target.value, index, 'price')}/>
    },
    {
        key: 'height', value: 'По умолчанию', data: (i, index) =>
            <div key={'ch' + index} className={' c-inline-block'}>
            <input key={'chin' + index} type="checkbox" id={"checkbox-1-2" + index}
                   checked={i.def}
                   onChange={() => actionChange(!i.def, index, 'def')}
                   className="regular-checkbox"/>
            <label key={'cch' + index} className={'margin-15  c-inline-block'}
                   htmlFor={"checkbox-1-2" + index}></label>
            </div>
    },
    {key: 'delete', value: '', onClick: actionDlt, actionKey: 'Удалить'}];

const bctKeySet = (actionDlt, actionChange, type) => [
    {key: 'image', value: '', path: ['element', 'imageSelect']},
    {key: 'name', value: 'Наименование', path: ['element', 'name']},
    {
        key: 'position', value: 'Доп.цена, руб', data: (i, index) =>  {return !i.def && <input
            className="form-control"
            key={'3' + type + index}
            type="number"
            placeholder="Дополнительная цена"
            value={i.price}
            onChange={(ev) => actionChange(ev.target.value, index, 'price', type)}/>}
    },
    {
        key: 'height', value: 'По умолчанию', data: (i, index) => <div key={'4' + type + index} className={' c-inline-block'}>
            <input key={type + index} type="checkbox" id={"checkbox-1-2" + type + index}
                   checked={i.def}
                   onChange={() => actionChange(!i.def, index, 'def', type)}
                   className="regular-checkbox"/>
            <label key={'5' + type + index} className={'margin-15  c-inline-block'}
                   htmlFor={"checkbox-1-2" + type + index}></label>
        </div>
    },
    {key: 'delete', value: '', onClick: (index)=> actionDlt(index, type), actionKey: 'Удалить'}];

class Config extends React.Component {


    state = {shawWall: true, selectedIds: []};

    componentWillMount() {
        if (this.props.match.params.id) {
            agent.BaseConfig.get(this.props.match.params.id)
                .then(rs => {
                    let doors = rs.elements.filter(i => i.elementType === 'DOOR');
                    doors.forEach(i => {
                        i.position = options.filter(o => o.value === i.position)[0]
                    });
                    let w = rs.elements.filter(i => i.elementType === 'WINDOW');
                    w.forEach(i => {
                        i.position = options.filter(o => o.value === i.position)[0]
                    });
                    this.setState({
                        posted: rs.posted,
                        element: rs, title: rs.name,
                        windowsEl: w,
                        doorsEl: doors,
                        TEXTURE_FLOOR: rs.elements.filter(i => i.elementType === 'TEXTURE_FLOOR'),
                        TEXTURE_INNER: rs.elements.filter(i => i.elementType === 'TEXTURE_INNER'),
                        TEXTURE_OUTER: rs.elements.filter(i => i.elementType === 'TEXTURE_OUTER')
                    })
                })
        } else {
            this.setState({
                element: {walls: [{depth: 70, def: true}]},
                title: getNameByPath(this.props.location.pathname),
                windowsEl: [],
                TEXTURE_FLOOR: [],
                TEXTURE_INNER: [],
                TEXTURE_OUTER: [],
                doorsEl: []
            })
        }
        agent.Elements.all('WINDOW').then((rs) => this.setState({windows: rs}));
        agent.Elements.all('DOOR').then((rs) => this.setState({doors: rs}));
        agent.Elements.all('TEXTURE').then((rs) => this.setState({texturesAll: rs}));
    }

    componentWillUnmount() {
        // this.props.onUnload();
    }

    posted() {
        agent.BaseConfig.changePostedBaseConfig(this.state.element.id)
            .then(() => {
                this.setState({posted: !this.state.posted});
            })
    }

    deleteConfig() {
        this.setState({needShowConfirm: true})
    }

    createCopy = () => {
        let elements = [];
        let walls = [];
        this.state.TEXTURE_FLOOR.forEach(i => {
            i.id = undefined;
            elements.push(i)
        });
        this.state.windowsEl.forEach(i => {
            i.position = i.position && i.position.value;
            i.id = undefined;
            elements.push(i)
        });
        this.state.doorsEl.forEach(i => {
            i.id = undefined;
            i.position = i.position && i.position.value;
            elements.push(i)
        });
        this.state.TEXTURE_INNER.forEach(i => {
            i.id = undefined;
            elements.push(i)
        });
        this.state.TEXTURE_OUTER.forEach(i => {
            i.id = undefined;
            elements.push(i)
        });
        this.state.element.walls.forEach(i => {
            i.id = undefined;
            walls.push(i)
        });
        let rq = {
            ...this.state.element,
            posted: false,
            walls: walls,
            name: `Копия ${this.state.element.name}`,
            id: undefined,
            elements: elements
        };

        agent.BaseConfig.saveNew(rq)
            .then(el => {
                this.setState({showConfirmationCreateCopy: true, copyId: el.id})
            })
    }

    submitForm() {
        let elements = [];
        this.state.TEXTURE_FLOOR.forEach(i => {
            elements.push(i)
        });
        this.state.windowsEl.forEach(i => {
            i.position = i.position && i.position.value;
            elements.push(i)
        });
        this.state.doorsEl.forEach(i => {
            i.position = i.position && i.position.value;
            elements.push(i)
        });
        this.state.TEXTURE_INNER.forEach(i => {
            elements.push(i)
        });
        this.state.TEXTURE_OUTER.forEach(i => {
            elements.push(i)
        });
        let rq = {...this.state.element, elements: elements};
        if (this.state.element.id) {
            agent.BaseConfig.save(rq).then(rs => {
                let doors = rs.elements.filter(i => i.elementType === 'DOOR');
                doors.forEach(i => {
                    i.position = options.filter(o => o.value === i.position)[0]
                });
                this.setState({
                    posted: rs.posted,
                    element: rs, title: rs.name,
                    windowsEl: rs.elements.filter(i => i.elementType === 'WINDOW'),
                    testures: rs.elements.filter(i => i.elementType === 'TEXTYRE'),
                    doorsEl: doors,
                    showConfirmation: true
                });

            })
        } else {
            agent.BaseConfig.saveNew(rq)
                .then(el => {
                    window.location.href = '/base-config/' + el.id
                })
        }
    }

    changeField = (v, key) => {
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

    deleteElement = (id) => {
        this.setState({windowsEl: this.state.windowsEl.filter((i, index) => index !== id)})
    }


    addElement() {
        this.setState({showModal: true})
    }

    addDoor() {
        this.setState({showModalDoor: true})
    }

    deleteDoor = (id) => {
        this.setState({doorsEl: this.state.doorsEl.filter((i, index) => index !== id)})
    }

    addWall = () => {
        let walls = this.state.element.walls;
        walls.push({description: 'Толщина утеплителя стены и потолка 50мм', depth: 70});
        this.setState({element: {...this.state.element, walls: walls}})
    };

    deleteWall = (index) => {
        let walls = this.state.element.walls;
        if (walls.filter((i, ind) => ind === index)[0].def) {
            walls.filter((i, ind) => ind !== index)[0].def = true
        }
        walls = walls.filter((i, ind) => ind !== index);

        this.setState({shawWall: false, element: {...this.state.element, walls: walls}});
        setTimeout(() => this.setState({shawWall: true}), 10)
    };


    changeWallField = (v, index, key) => {
        this.state.element.walls.filter((i, ind) => ind === index)[0][key] = v;
        if (key === 'def' && v) {
            this.state.element.walls.filter((i, ind) => ind !== index).forEach(i => i.def = false);
        }
        this.setState({newValue: v})
    }


    changeDoorSetting = (v, index, key) => {
        this.state.doorsEl.filter((i, ind) => ind === index)[0][key] = v;
        this.setState({newValue: v})
    }

    changeWindowSetting = (v, index, key) => {
        this.state.windowsEl.filter((i, ind) => ind === index)[0][key] = v;
        this.setState({newValue: v})
    }


    _addElement = (id) => {

        let elements = this.state.windowsEl;
        elements.push({element: this.state.windows.filter(i => i.id === id)[0], elementType: 'WINDOW'});
        this.setState({showModal: false, windowsEl: elements})
    }

    _addDoor = (id) => {
        let elements = this.state.doorsEl;
        elements.push({element: this.state.doors.filter(i => i.id === id)[0], elementType: 'DOOR'});
        this.setState({showModalDoor: false, doorsEl: elements})
    }


    _addTexture = (id, type) => {
        let elements = this.state[type] || [];
        if (elements.map(item=> item.id).indexOf(id) === -1) {
            elements.push({element: this.state.texturesAll.filter(i => i.id === id)[0], elementType: type});
        }
        this.setState({['showModal' + type]: false, [type]: elements})
    }

    addTextyre = (type) => {
        this.setState({['showModal' + type]: true, selectedIds: []})
    }

    deleteTexture = (id, type) => {
        this.setState({[type]: this.state[type].filter((i, index) => index !== id)})
    };

    changeTetureField = (v, index, key, type) => {
        this.state[type].filter((i, ind) => ind === index)[0][key] = v;
        if (key === 'def' && v) {
            this.state[type].filter((i, ind) => ind !== index).forEach(i => i.def = false);
        }
        this.setState({newValue: v})
    };

    render() {
        if (!this.state.element) {
            return null;
        }
        let type = this.state.element.elementType;
        return (
            <MainView type={TYPES.BASE_CONFIG} hideAdd={true} appName={this.state.title}>
                <hr/>
                <form>
                    <div className={'custom-field'}>
                        <div className={"c-fool-width"}>
                            {Field('Наименование отображаемое пользователю', 'name', this.state, this.changeField)}
                        </div>
                        <div className={"c-fool-width"}>
                            {Field2("Длина, мм", "width", this.state, this.changeField)}
                            {Field2("Ширина, мм", "height", this.state, this.changeField)}
                        </div>

                        <div className={"c-fool-width"}>
                            {Field2("Цена, руб", "price", this.state, this.changeField)}
                            {Field2("Позиция отображения в списке", "priority", this.state, this.changeField)}
                        </div>
                        <hr/>
                        <div className={"c-fool-width"}>
                            {FieldText("Цвет полосы под бытовкой(пример #000000 - черный, #FF0000 - красный)",
                                "colorButtomLine", this.state, this.changeField)}
                            {Field2("Высота полосы под бытовкой, мм", "bottomLineHeight", this.state, this.changeField)}
                        </div>
                        Полоса отрисуется если задан размер и <a href={'https://colorscheme.ru/html-colors.html'}
                                                                 target={'_blank'}> цвет</a>

                        <AccordionComponent id={1} title={'Окна (включенные в стоимость базовой комплектации)'}>

                            <span className={'link'} onClick={() => this.addElement()}>Добавить окно</span>
                            <Table elements={this.state.windowsEl}
                                   keySet={bcwKeySet(this.deleteElement, this.changeWindowSetting)} notLink={true}/>

                        </AccordionComponent>
                        <AccordionComponent id={2}
                                            title={'Двери входные (включенные в стоимость базовой комплектации)'}>
                            <span className={'link'} onClick={() => this.addDoor()}>Добавить входную дверь</span>
                            <Table elements={this.state.doorsEl}
                                   keySet={bcwKeySet(this.deleteDoor, this.changeDoorSetting)}
                                   notLink={true}/>
                        </AccordionComponent>
                        <AccordionComponent id={3} title={'Настройки наружных стен'}>
                            <span className={'link'} onClick={() => this.addWall()}>Добавить настройку стены</span>

                            {this.state.element && this.state.element.walls && this.state.element.walls.length > 0 &&
                            <Table elements={this.state.element.walls}
                                   keySet={bcWallKeySet(this.deleteWall, this.changeWallField)}
                                   notLink={true}/>}

                        </AccordionComponent>
                        <AccordionComponent id={4} title={'Настройки наружных текстур'}>
                            {this.renderTexture('Настройка наружных текстур',
                                this.state.TEXTURE_OUTER, 'TEXTURE_OUTER', this.deleteTexture,
                                this.changeTetureField, this.addTextyre
                            )}
                        </AccordionComponent>
                        <AccordionComponent id={5} title={'Настройки внутренних текстур'}>
                            {this.renderTexture('Настройка внутренних текстур',
                                this.state.TEXTURE_INNER, 'TEXTURE_INNER', this.deleteTexture,
                                this.changeTetureField, this.addTextyre
                            )}
                        </AccordionComponent>
                        <AccordionComponent id={6} title={'Настройка напольного покрытия'}>
                            {this.renderTexture('Настройка напольного покрытия',
                                this.state.TEXTURE_FLOOR, 'TEXTURE_FLOOR', this.deleteTexture,
                                this.changeTetureField, this.addTextyre
                            )}
                        </AccordionComponent>

                        <div className="btn btn-lg btn-primary"
                             onClick={() => this.submitForm()}>
                            Сохранить
                        </div>
                        <div className="btn btn-lg btn-primary"
                             onClick={() => this.createCopy()}>
                            Создать копию
                        </div>
                        {this.state.element.id && <div className="btn btn-lg btn-primary"
                                                       onClick={() => this.posted()}>
                            {this.state.posted ? 'Скрыть в калькуляторе' : 'Отображать в калькуляторе'}
                        </div>}
                        {this.state.element.id && <div className="btn btn-lg btn-primary"
                                                       onClick={() => this.deleteConfig()}>
                            {'Удалить'}
                        </div>}
                    </div>
                </form>
                {this.state && this.renderModal(this.state.showModalTEXTURE_OUTER, this.state.texturesAll, (id) => this._addTexture(id, 'TEXTURE_OUTER'), 'TEXTURE')}
                {this.state && this.renderModal(this.state.showModalTEXTURE_INNER, this.state.texturesAll, (id) => this._addTexture(id, 'TEXTURE_INNER'), 'TEXTURE')}
                {this.state && this.renderModal(this.state.showModalTEXTURE_FLOOR, this.state.texturesAll, (id) => this._addTexture(id, 'TEXTURE_FLOOR'), 'TEXTURE')}
                {this.state && this.renderModal(this.state.showModal, this.state.windows, this._addElement)}
                {this.state.needShowConfirm && this.renderConfirm()}
                {this.state.showConfirmation && this.confirmation("Данные обновлены",
                    [{label: "Вернуться в список", action: this.back},
                        {label: "Продолжить редактирование", action: ()=>{this.setState({showConfirmation: false})}}])}
                {this.state.showConfirmationCreateCopy && this.confirmation("Копия настройки создана.",
                    [{label: "Вернуться в список", action: this.back},
                        {label: "Закрыть окно", action: ()=>{this.setState({showConfirmationCreateCopy: false})}},
                        {label: "Открыть копию", action: ()=>{ window.location.href = '/base-config/' + this.state.copyId}}
                        ])}
                {this.state && this.renderModal(this.state.showModalDoor, this.state.doors ? this.state.doors.filter(i => i.outer) : [], this._addDoor)}

            </MainView>
        );
    }

    addToSelected = (id) => {
        let selectedIds = this.state.selectedIds;
        if(selectedIds.indexOf(id) > -1){
            selectedIds = selectedIds.filter(i => i!==id);
        } else {
            selectedIds.push(id);
        }
        this.setState({selectedIds:selectedIds})
    };

    renderTexture = (name, elements, type, deleteFn, changeField, addFunction) => {
        return <div><span className={'link'} onClick={() => addFunction(type)}>Добавить текстуру</span>
            <Table elements={elements}
                   keySet={bctKeySet(deleteFn, changeField, type)} notLink={true}/>
            <hr/>
        </div>
    };

    renderModal = (needShow, elements, onClick, type) => {
        let keySet = type === 'TEXTURE' ? textureKeySetSelected: windowKeySetSelected;

        return needShow && <div className={'modal-div-back'}>
            <div className={'modal-div'}>
                <Table elements={elements} onRowClick={onClick}
                       keySet={keySet(this.addToSelected)} notLink={true}/>
                <div onClick={() => {
                    this.state.selectedIds.forEach(onClick);
                    this.setState({
                        showModalTEXTURE_OUTER: false,
                        showModalTEXTURE_INNER: false,
                        showModalTEXTURE_FLOOR: false,
                        showModal: false,
                        showModalDoor: false,
                        selectedIds: []
                    })
                }} className={'add-new float'}>Добавить выбранные </div>
                <div onClick={() => this.setState({
                    showModalTEXTURE_OUTER: false,
                    showModalTEXTURE_INNER: false,
                    showModalTEXTURE_FLOOR: false,
                    showModal: false,
                    showModalDoor: false,
                    selectedIds: []
                })} className={'add-new float'}>Отмена </div>
            </div>
        </div>
    }

    renderConfirm = () => {
        return <div className={'modal-div-back'}>
            <div className={'modal-div-confirm'}>
                <h1>Удалить базовую конфигурацию?</h1>
                {this.state.element.id && <div className="btn btn-lg btn-primary"
                                               onClick={() => {
                                                   agent.BaseConfig.deleteBaseConfig(this.state.element.id)
                                                       .then(() => {
                                                           this.back()
                                                       })
                                               }}>
                    {'Удалить'}
                </div>}
                {this.state.element.id && <div className="btn btn-lg btn-primary"
                                               onClick={() => this.setState({needShowConfirm: false})}>
                    {'Отмена'}
                </div>}
            </div>
        </div>
    }

    back =() => {
        window.location = '/base-configuration'
    }

    confirmation = (text, btns) => {
        return <div className={'modal-div-back'}>
            <div className={'modal-div-confirm'}>
                <h3>{text}</h3>
                <hr/>
                {btns.map(btn => {
                    return <div className="btn btn-lg btn-primary"
                                onClick={btn.action}>
                        {btn.label}
                    </div>
                })}
            </div>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Config);
