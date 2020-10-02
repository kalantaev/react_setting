import React from 'react';
import {Link} from "react-router-dom";
import {getPathByTagName} from "../../constants/function";


const MenuItem = props => {
  const tags = props.tags;
  if (tags) {
    return (
      <div className="tag-list">
        <hr/>
        <a href={'http://37.140.198.217/calculator.html'} className={'tag-pill'}> Демо конструктор</a>
        <hr/>
        {
          tags.map((tag, index) => {
            return (
              <div key={'mi'+index}>
                <Link className="tag-pill" to={getPathByTagName(tag)}>
                  {tag}
                </Link>
                <hr/>
              </div>
            );
          })
        }
          {/*<a href={'/updates'} className={'tag-pill'}>Журнал обновлений</a>*/}
      </div>
    );
  } else {
    return (
      <div>Loading Tags...</div>
    );
  }
};

export default MenuItem;
