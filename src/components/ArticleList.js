import ArticlePreview from './ArticlePreview';
import ListPagination from './ListPagination';
import React from 'react';

const ArticleList = props => {
  if (!props.elements) {
    return (
      <div className="article-preview">Загрузка...</div>
    );
  }

  if (props.elements.length === 0) {
    return (
      <div className="article-preview">
        No articles are here... yet.
      </div>
    );
  }
  return (
    <div>
      {
        props.elements[0].map(el => {
          return (
            <ArticlePreview el={props.elements} element={el} key={el.id} updateElements={props.updateElements}/>
          );
        })
      }

      <ListPagination
        pager={props.pager}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} />
    </div>
  );
};

export default ArticleList;
