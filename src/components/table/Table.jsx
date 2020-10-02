import React from 'react';
import '../../styles.css'
import {image} from "../Image";

export const TableHeader = props => {
    return (<thead>
    <tr>{
        props.keySet && props.keySet.map((el, index) => {
            return <th key={'head-th'+index}>{el.value}</th>
        })}</tr>
    </thead>);
};
export const TableBody = (props) => {
    return (<tbody>{
        props.elements.map((el, index) => {
            return <tr key={index+'rt'}>{props.keySet && props.keySet.map(keyValue => {
                let value;
                if (keyValue.path && keyValue.path.length > 0) {
                    value = el;
                    keyValue.path.forEach(item => value = value[item])
                }
                return <th key={index+'th'+keyValue.key} width={keyValue.size ? (keyValue.size + '%') : ''} onClick={() => {
                    if (keyValue.key !== 'select' && !!props.onRowClick) {
                        props.onRowClick(el.id)
                    } else if (keyValue.key !== 'action' && !props.notLink) {
                        window.location = `/${el.elementType.toLowerCase()}/${el.id}`
                    }
                }}>{!!keyValue.data ? keyValue.data(el, index) :
                    !!keyValue.actionKey ?
                        <div key={index+'div'+keyValue.key} className={'link'} onClick={() => keyValue.onClick(index)}>{keyValue.actionKey}</div> :
                        keyValue.key === 'image' ? (image(!!value ? value : el.imageSelect, undefined, 40)) :
                            keyValue.key === 'inner' ? (el[keyValue.key] ? "Да" : "Нет") :
                                keyValue.key !== 'action' ? value || el[keyValue.key] :
                                    <div key={index+'div2'+keyValue.key} className={'btn btn-primary btn-sml'}
                                         onClick={() => {
                                             props.actionBtn(el.id)
                                         }}>
                                        {props.actionLblFn(el)}
                                    </div>}</th>
            })}</tr>
        })}
    </tbody>);
}


const Table = props => {
    if (props.loading) {
        return (<div>
                <table className={'table'}>
                    {TableHeader(props)}
                </table>
                <div className="article-preview">Данные загружаются...</div>
            </div>
        );
    }

    if (props.elements.length === 0) {
        return (
            <div className="article-preview">
                Нет данных для отображения
            </div>
        );
    }
    return (
        <table className={'table'}>
            {TableHeader(props)}
            {TableBody(props)}
        </table>
    );
};

export default Table;
