import React from 'react';
import {getNameByTag, getPathByTagName, getPathNewByPath, menuItems} from "../../constants/function";
import {Link} from "react-router-dom";
import Banner from "./Banner";
import MenuItem from "./MenuItem";

const GlobalFeedTab = props => {
    return (
        <li className="nav-item">
            <a
                href="/"
                className={!props.type ? 'nav-link active' : 'nav-link'}>Главная</a>
        </li>
    );
};


const TagFilterTab = props => {
    if (!props.tag) {
        return null;
    }

    return (
        <li className="nav-item">
            <a href={getPathByTagName(getNameByTag(props.tag))} className="nav-link active">
                <i className="ion-pound"></i>{getNameByTag(props.tag)}
            </a>
        </li>
    );
};

const MainView = props => {
    return (
        <div className="home-page">
            {/*<Banner token={props.token} appName={props.appName}/>*/}
            <div className="container page">
                <div className="row">
                    <div className="col-md-3">
                        <div className="sidebar">
                            <p>Меню</p>
                            <MenuItem tags={menuItems}/>
                        </div>
                    </div>
                    <div className="col-md-9">
                        {!props.hideAdd && <div className="feed-toggle">
                            <ul className="nav nav-pills outline-active">
                                <GlobalFeedTab type={props.type}/>
                                <TagFilterTab tag={props.type}/>
                            </ul>
                            {!props.hideAdd && <Link className="add-new float-right"
                                  to={getPathNewByPath(window.location.pathname)}>Добавить</Link>}
                        </div>}
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainView;
