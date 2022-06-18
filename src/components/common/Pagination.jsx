import React from 'react';

function Pagination({
  page,
  loading,
  hasNextPage,
  goToPage
}) {
  return (
    <ul className="pagination m-0 float-right">
      <li className={`page-item ${page === 1 || loading ? 'disabled' : ''}`}>
        <button
          type="button"
          className="page-link"
          disabled={page === 1 || loading}
          onClick={() => {
            goToPage(page - 1);
          }}
          data-test="paginationPrevious"
        >
          &laquo;
        </button>
      </li>
      <li className="page-item disabled">
        <span className="page-link" data-test="paginationNumber">{page}</span>
      </li>
      <li className={`page-item ${!hasNextPage || loading ? 'disabled' : ''}`}>
        <button
          type="button"
          className="page-link"
          disabled={!hasNextPage || loading}
          onClick={() => {
            goToPage(page + 1);
          }}
          data-test="paginationNext"
        >
          &raquo;
        </button>
      </li>
    </ul>
  );
}

export default Pagination;
