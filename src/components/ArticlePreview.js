import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import { ARTICLE_FAVORITED, ARTICLE_UNFAVORITED } from '../constants/actionTypes';

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';

const mapDispatchToProps = dispatch => ({
  favorite: slug => dispatch({
    type: ARTICLE_FAVORITED,
    payload: agent.Articles.favorite(slug)
  }),
  unfavorite: slug => dispatch({
    type: ARTICLE_UNFAVORITED,
    payload: agent.Articles.unfavorite(slug)
  })
});

const ArticlePreview = props => {
  const article = props.element;
  const favoriteButtonClass = article.favorited ?
    FAVORITED_CLASS :
    NOT_FAVORITED_CLASS;

  const handleClick = ev => {
    ev.preventDefault();
    if (article.favorited) {
      props.unfavorite(article.slug);
    } else {
      props.favorite(article.slug);
    }
  };
  console.info(article)
  return (
    <div className="article-preview">
      {article && <Link to={`/${article.elementType.toLowerCase()}/${article.id}`} className="preview-link">
        <h1>{article.name}</h1>
        {article.elementType !== 'TEXTURE' && <p>{article.name} ширина: {article.width}, высота: {article.height}, цена: {article.price}руб. </p>}
      </Link>}
      {article && article.elementType === 'BASE-CONFIG' && <div className="btn btn-lg btn-primary"
           onClick={() =>{
             agent.BaseConfig.changePostedBaseConfig(article.id)
                 .then(()=> {
                 props.updateElements(article.id)
                 });
                 }
           }>
        {article.posted ? 'Скрыть в калькуляторе' : 'Отображать в калькуляторе'}
      </div>}
    </div>
  );
}

export default connect(() => ({}), mapDispatchToProps)(ArticlePreview);
