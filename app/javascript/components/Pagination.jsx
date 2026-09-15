import React, { useEffect } from "react";
import styles from "@stylesheets/Pagination.module.css";

export default function Pagination({ pages }) {
  if (pages.count < 2) return null;

  useEffect(() => {
    history.replaceState(null, "", pages.paths[pages.current - 1].url);
  }, [pages]);

  const startIndex = pages.current - 4 < 0 ? 0 : pages.current - 4;
  const shownPages = pages.paths.slice(startIndex, pages.current + 3);
  const fromItem = pages.current * pages.perPage - pages.perPage + 1;
  const toItem =
    pages.current * pages.perPage > pages.totalCount
      ? pages.current * pages.perPage -
        (pages.current * pages.perPage - pages.totalCount)
      : pages.current * pages.perPage;

  const DirectionButton = ({ index, title, text }) => (
    <a href={pages.paths[index].url} title={title} data-sg-remote>
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
          data-sg-remote
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
        Showing {fromItem} - {toItem} of {pages.totalCount}
      </p>
    </div>
  );
}
