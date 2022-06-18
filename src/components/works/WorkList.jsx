import {
  gql,
  useLazyQuery,
  useMutation
} from '@apollo/client';
import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import { Link, useLocation } from 'react-router-dom';

import Pagination from '@/components/common/Pagination';
import { showWarningDialog } from '@/utils/alert';

export const WORKS_QUERY = gql`
  query Works($page: Int!) {
    works(page: $page) {
      edges {
        node {
          id
          title
          category {
            id
            name
          }
          modelFilename
          coverFilename
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const DELETE_WORK_MUTATION = gql`
  mutation DeleteWork($id: Int!) {
    deleteWork(id: $id)
  }
`;

function WorkList() {
  const [listWorks, { data, loading }] = useLazyQuery(WORKS_QUERY);

  const location = useLocation();
  const [page, setPage] = useState();
  const goToPage = useCallback(async (thatPage) => {
    await listWorks({
      variables: {
        page: thatPage
      }
    });
    setPage(thatPage);
  }, [listWorks]);
  useEffect(() => {
    goToPage((location.state && location.state.page) || 1);
  }, [goToPage, location.state]);

  const [deleteWork, { loading: deleteWorkLoading }] = useMutation(
    DELETE_WORK_MUTATION,
    {
      context: { authRequired: true }
    }
  );

  const clickDeleteWork = (work) => {
    showWarningDialog(
      `Do you want to delete "${work.title}"?`,
      async () => {
        await deleteWork({
          variables: {
            id: work.id
          }
        });
        await listWorks({
          variables: {
            page
          }
        });
      }
    );
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex p-0">
                <h3 className="card-title p-3">
                  <i className="fa fa-list-ul" />
                </h3>
                <ul className="nav nav-pills ml-auto p-2">
                  <li className="nav-item">
                    <Link className="nav-link active" to="create" state={{ page }} data-test="create">Create</Link>
                  </li>
                </ul>
              </div>
              <div className="card-body table-responsive p-0">
                <table className="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Operations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.works.edges.map(({ node: work }, index) => (
                      <tr key={work.id}>
                        <td>{work.id}</td>
                        <td className="preserve">{work.title}</td>
                        <td className="preserve">{work.category.name}</td>
                        <td>
                          <Link to={`${work.id}`} state={{ page }}>
                            <button
                              type="button"
                              className="btn-xs btn-info operation-button"
                              data-test="edit"
                              data-test-index={`${index}`}
                            >
                              Edit
                            </button>
                          </Link>
                          <button
                            type="button"
                            className="btn-xs btn-danger operation-button"
                            disabled={deleteWorkLoading}
                            onClick={() => { clickDeleteWork(work); }}
                            data-test="delete"
                            data-test-index={`${index}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer clearfix">
                {data && (
                  <Pagination
                    page={page}
                    loading={loading}
                    hasNextPage={data.works.pageInfo.hasNextPage}
                    goToPage={goToPage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkList;
