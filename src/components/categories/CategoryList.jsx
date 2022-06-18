import {
  gql,
  useLazyQuery,
  useMutation
} from '@apollo/client';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { alertMessage, showWarningDialog } from '@/utils/alert';

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id)
  }
`;

function CategoryList() {
  const [listCategories, { data }] = useLazyQuery(CATEGORIES_QUERY);

  useEffect(() => {
    listCategories();
  }, [listCategories]);

  const [deleteCategory, { loading: deleteCategoryLoading }] = useMutation(
    DELETE_CATEGORY_MUTATION,
    {
      context: { authRequired: true }
    }
  );

  const clickDeleteCategory = (category) => {
    showWarningDialog(
      `Do you want to delete "${category.name}"?`,
      async () => {
        try {
          await deleteCategory({
            variables: {
              id: category.id
            }
          });
          await listCategories();
        } catch (e) {
          if (e.graphQLErrors && e.graphQLErrors.length) {
            switch (e.graphQLErrors[0].message) {
              case 'category_not_found':
                listCategories();
                break;
              case 'not_empty':
                alertMessage('Cannot delete that category，because more than one work belonging to it exists.');
                break;
              default:
            }
          }
        }
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
                    <Link className="nav-link active" to="create" data-test="create">Create</Link>
                  </li>
                </ul>
              </div>
              <div className="card-body table-responsive p-0">
                <table className="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Operations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.categories.edges.map(({ node: category }, index) => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td className="preserve">{category.name}</td>
                        <td>
                          <Link to={`${category.id}`}>
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
                            disabled={deleteCategoryLoading}
                            onClick={() => { clickDeleteCategory(category); }}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryList;
