import {
  gql,
  useMutation,
  useQuery
} from '@apollo/client';
import React from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

import WorkForm from '@/components/works/WorkForm';

export const WORK_QUERY = gql`
  query Work($id: Int!) {
    work(id: $id) {
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
`;

export const UPDATE_WORK_MUTATION = gql`
  mutation UpdateWork(
      $id: Int!,
      $title: String!,
      $categoryId: Int!,
      $modelFile: Upload,
      $modelFilename: String,
      $coverFile: Upload,
      $coverFilename: String) {
    updateWork(id: $id, input: {
        title: $title,
        categoryId: $categoryId,
        modelFile: $modelFile,
        modelFilename: $modelFilename,
        coverFile: $coverFile,
        coverFilename: $coverFilename
    }) {
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
`;

function WorkEdit() {
  const location = useLocation();
  const page = (location.state && location.state.page) || 1;
  const navigate = useNavigate();
  const { id: paramsId } = useParams();
  const id = parseInt(paramsId, 10);
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(WORK_QUERY, {
    variables: {
      id
    }
  });
  const [updateWork, { loading }] = useMutation(UPDATE_WORK_MUTATION, {
    context: { authRequired: true }
  });

  const onSubmit = async (values) => {
    await updateWork({ variables: values });
    navigate('..', {
      state: {
        page
      }
    });
  };
  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Link className="btn btn-success btn-xs" to=".." state={{ page }}>
                    <i className="fa fa-arrow-left" />
                  </Link>
                  <span className="p-2">Edit</span>
                </h3>
              </div>
              {!queryLoading && !queryError && (
                <WorkForm
                  initialValues={{
                    ...queryData.work,
                    categoryId: queryData.work.category.id,
                    modelFile: undefined,
                    coverFile: undefined
                  }}
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

export default WorkEdit;
