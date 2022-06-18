import {
  gql,
  useMutation,
  useQuery
} from '@apollo/client';
import React from 'react';
import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom';

import CategoryForm from '@/components/categories/CategoryForm';
import { alertMessage } from '@/utils/alert';

export const CATEGORY_QUERY = gql`
  query Category($id: Int!) {
    category(id: $id) {
      id
      name
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: Int!, $name: String!) {
    updateCategory(id: $id, input: {name: $name}) {
      id
      name
    }
  }
`;

function CategoryEdit() {
  const navigate = useNavigate();
  const { id: paramsId } = useParams();
  const id = parseInt(paramsId, 10);
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(CATEGORY_QUERY, {
    variables: {
      id
    }
  });
  const [updateCategory, { loading }] = useMutation(UPDATE_CATEGORY_MUTATION, {
    context: { authRequired: true }
  });

  const onSubmit = async (values) => {
    try {
      await updateCategory({ variables: values });
      navigate('..');
    } catch (e) {
      if (e.graphQLErrors && e.graphQLErrors.length) {
        switch (e.graphQLErrors[0].message) {
          case 'conflict':
            alertMessage('That name is taken. Try another.');
            break;
          default:
        }
      }
    }
  };
  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Link className="btn btn-success btn-xs" to=".."><i className="fa fa-arrow-left" /></Link>
                  <span className="p-2">Edit</span>
                </h3>
              </div>
              {!queryLoading && !queryError && (
                <CategoryForm
                  initialValues={queryData.category}
                  onSubmit={onSubmit}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryEdit;
