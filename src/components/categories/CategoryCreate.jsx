import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import CategoryForm from '@/components/categories/CategoryForm';
import { alertMessage } from '@/utils/alert';

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($name: String!) {
    createCategory(input: {name: $name}) {
      id
      name
    }
  }
`;

function CategoryCreate() {
  const navigate = useNavigate();
  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY_MUTATION, {
    context: { authRequired: true }
  });

  const initialValues = {
    name: ''
  };
  const onSubmit = async (values) => {
    try {
      await createCategory({ variables: values });
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
                  <span className="p-2">Create</span>
                </h3>
              </div>
              <CategoryForm
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

export default CategoryCreate;
