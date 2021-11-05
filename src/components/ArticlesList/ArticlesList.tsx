import React from 'react';
import styles from './ArticlesList.module.scss';

type Article = {
  author: string;
  authorLink: string;
  date: string;
  description: string;
  tags: string;
  title: string;
};

type Props = {
  articles: Article[];
};

export default function ArticlesList({ articles }: Props) {
  const [tags, setTags] = React.useState<string[]>([]);
  const [articlesToRender, setArticlesToRender] = React.useState<Article[]>(articles);
  const [filterTag, setFilterTag] = React.useState('');

  const filterArticles = React.useCallback(() => {
    if (filterTag === '') {
      return setArticlesToRender(articles);
    }

    setArticlesToRender(
      articles.filter((article) => {
        const _tags = [];
        article.tags.split(',').forEach((_t) => _tags.push(_t.trim()));

        if (_tags.includes(filterTag)) {
          return article;
        }
      })
    );
  }, [filterTag, articles]);

  const collectTags = React.useCallback(() => {
    if (tags.length) {
      return;
    }

    const allTags = new Set();

    articles.forEach((article) => {
      article.tags.split(',').forEach((t) => allTags.add(t.trim()));
    });

    setTags(Array.from(allTags));
  }, [tags]);

  React.useEffect(() => {
    collectTags();
    filterArticles();
  }, [collectTags, filterArticles]);

  return (
    <>
      {articles.length > 1 ? (
        <ul className={styles['tags-list']}>
          {tags.map((tag) => (
            <li key={tag}>
              <div className={styles['tags-list--tag']}>
                {filterTag === tag ? (
                  <button type="button" data-filter-tag="true" onClick={() => setFilterTag('')}>
                    {tag}
                  </button>
                ) : (
                  <button
                    type="button"
                    data-filter-tag={filterTag === ''}
                    onClick={() => setFilterTag(tag)}
                  >
                    {tag}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <>
        {articlesToRender.length ? (
          <ul className={styles['article-list']}>
            {articlesToRender
              .sort((a, b) => (a.id > b.id ? -1 : 1))
              .map((article) => (
                <li key={article.url} className={styles['article-list--item']}>
                  <div className={styles['article-list--item--heading']}>
                    <strong>
                      <a href={article.url}>{article.title}</a>
                    </strong>
                    <div>{article.date}</div>
                  </div>

                  <div className={styles['article-list--item--author']}>
                    <span>by </span>
                    <a href={article.authorLink} target="_blank" rel="noopener noreferrer">
                      {article.author}
                    </a>
                  </div>

                  <p className={styles['article-list--item--description']}>{article.description}</p>
                </li>
              ))}
          </ul>
        ) : (
          <div className={styles['none-message']}>
            <strong>NOTHING YET</strong>
            <br />
            <em>check back soon though!!</em>
          </div>
        )}
      </>
    </>
  );
}
