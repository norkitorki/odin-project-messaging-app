import React from "react";
import styles from "@stylesheets/Pagination.module.css";

export default function Pagination({ pages }) {
  if (pages.count < 2) return null;

  const startIndex = pages.current - 4 < 0 ? 0 : pages.current - 4;
  const shownPages = pages.paths.slice(startIndex, pages.current + 3);
  const fromItem = pages.current * pages.per_page - pages.per_page + 1;
  const toItem =
    pages.current * pages.per_page > pages.total_count
      ? pages.current * pages.per_page -
        (pages.current * pages.per_page - pages.total_count)
      : pages.current * pages.per_page;

  const DirectionButton = ({ index, title, text }) => (
    <a href={pages.paths[index].url} title={title} data-sg-visit>
      {text}
    </a>
  );

  return (
    <div className={styles.pagination}>
      {pages.current > 1 && (
        <>
          {pages.current > 4 && (
            <DirectionButton index={0} title={"first page"} text={"<<"} />
          )}
          <DirectionButton
            index={pages.current - 2}
            title={"previous page"}
            text={"<"}
          />
        </>
      )}

      {shownPages.map((path) => (
        <a
          key={path.page}
          href={path.url}
          className={path.page === pages.current ? styles.current : ""}
          data-sg-visit
        >
          {path.page}
        </a>
      ))}

      {pages.current < pages.count && (
        <>
          <DirectionButton
            index={pages.current}
            title={"next page"}
            text={">"}
          />
          {pages.current < pages.count - 3 && (
            <DirectionButton
              index={pages.count - 1}
              title={`last page (${pages.count})`}
              text={">>"}
            />
          )}
        </>
      )}
      <p className={styles.itemCounter}>
        Showing {fromItem} - {toItem} of {pages.total_count}
      </p>
    </div>
  );
}
