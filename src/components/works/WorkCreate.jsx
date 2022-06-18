import { gql, useMutation } from '@apollo/client';
import React from 'react';
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import WorkForm from '@/components/works/WorkForm';

export const CREATE_WORK_MUTATION = gql`
  mutation CreateWork(
      $title: String!,
      $categoryId: Int!,
      $modelFile: Upload!,
      $coverFile: Upload!) {
    createWork(input: {
        title: $title,
        categoryId: $categoryId,
        modelFile: $modelFile,
        coverFile: $coverFile
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

function WorkCreate() {
  const location = useLocation();
  const page = (location.state && location.state.page) || 1;
  const navigate = useNavigate();
  const [createWork, { loading }] = useMutation(CREATE_WORK_MUTATION, {
    context: { authRequired: true }
  });

  const initialValues = {
    title: '',
    categoryId: null,
    modelFile: undefined,
    coverFile: undefined
  };
  const onSubmit = async (values) => {
    await createWork({ variables: values });
    navigate('..');
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
                  <span className="p-2">Create</span>
                </h3>
              </div>
              <WorkForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkCreate;
