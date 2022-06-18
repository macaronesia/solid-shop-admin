import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { Formik } from 'formik';
import React from 'react';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 1,
      errorMessage: {
        minLength: 'Required'
      }
    },
    password: {
      type: 'string',
      minLength: 4,
      errorMessage: {
        minLength: 'Must be between 4 and 32 characters long'
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

function AuthForm({
  initialValues,
  onSubmit,
  loading,
  authType
}) {
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
            <div className="input-group mb-3">
              <input
                type="text"
                name="username"
                className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                placeholder="Username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                maxLength="32"
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-user" />
                </div>
              </div>
              <span className="error invalid-feedback">{errors.username && touched.username && errors.username}</span>
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                name="password"
                className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                placeholder="Password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                maxLength="32"
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock" />
                </div>
              </div>
              <span className="error invalid-feedback">{errors.password && touched.password && errors.password}</span>
            </div>
            <div className="social-auth-links text-center mb-3">
              <button type="submit" className="btn btn-block btn-primary" disabled={loading} data-test="submit">
                {authType === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
        )
      }
    </Formik>
  );
}

export default AuthForm;
