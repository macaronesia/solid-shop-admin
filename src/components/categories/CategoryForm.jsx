import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { Formik } from 'formik';
import React from 'react';

import TextField from '@/components/common/fields/TextField';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: {
        minLength: 'Required'
      }
    }
  }
};
const validate = ajv.compile(schema);

const validateForm = (values) => {
  const errors = {};
  if (!validate(values)) {
    Object.keys(schema.properties).forEach((key) => {
      const error = validate.errors.find(
        (err) => err.instancePath === `/${key}` && err.keyword === 'errorMessage'
      );
      if (error) {
        errors[key] = error.message;
      }
    });
  }
  return errors;
};

function CategoryForm({ initialValues, onSubmit, loading }) {
  return (
    <Formik
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={onSubmit}
    >
      {
        ({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <TextField
                title="Name"
                id="name"
                name="name"
                maxLength={32}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={errors.name && touched.name}
                error={errors.name}
              />
            </div>
            <div className="card-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                data-test="submit"
              >
                Submit
              </button>
            </div>
          </form>
        )
      }
    </Formik>
  );
}

export default CategoryForm;
