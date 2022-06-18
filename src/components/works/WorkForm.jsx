import { gql, useQuery } from '@apollo/client';
import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { Formik } from 'formik';
import React from 'react';

import FileField from '@/components/common/fields/FileField';
import ImageField from '@/components/common/fields/ImageField';
import SelectField from '@/components/common/fields/SelectField';
import TextField from '@/components/common/fields/TextField';

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

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);
const schema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      minLength: 1,
      errorMessage: {
        minLength: 'Required'
      }
    },
    categoryId: {
      type: 'integer',
      errorMessage: {
        type: 'Required'
      }
    }
  },
  allOf: [
    {
      oneOf: [
        {
          required: ['modelFile'],
          errorMessage: {
            required: 'Required'
          }
        },
        {
          required: ['modelFilename']
        }
      ]
    },
    {
      oneOf: [
        {
          required: ['coverFile'],
          errorMessage: {
            required: 'Required'
          }
        },
        {
          required: ['coverFilename']
        }
      ]
    }
  ]
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
    [
      { key: 'modelFile', schemaPath: '#/allOf/0/oneOf/0/errorMessage' },
      { key: 'coverFile', schemaPath: '#/allOf/1/oneOf/0/errorMessage' }
    ].forEach((item) => {
      const error = validate.errors.find((err) => err.schemaPath === item.schemaPath);
      if (error) {
        errors[item.key] = error.message;
      }
    });
  }
  return errors;
};

function WorkForm({ initialValues, onSubmit, loading }) {
  const { data: categoriesQueryData } = useQuery(CATEGORIES_QUERY);

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
          handleSubmit,
          setFieldValue,
          setFieldTouched
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <TextField
                title="Title"
                id="title"
                name="title"
                maxLength={32}
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={errors.title && touched.title}
                error={errors.title}
              />
              <SelectField
                title="Category"
                id="categoryId"
                name="categoryId"
                options={categoriesQueryData && categoriesQueryData.categories.edges.map(
                  ({ node: category }) => ({ name: category.name, value: category.id })
                )}
                value={values.categoryId}
                onSelect={(value) => {
                  setFieldValue('categoryId', value);
                }}
                onBlur={handleBlur}
                invalid={errors.categoryId && touched.categoryId}
                error={errors.categoryId}
              />
              <FileField
                title="Model file (.glb)"
                id="modelFile"
                accept=".glb,model/gltf-binary"
                value={values.modelFile}
                onSelect={(file) => {
                  setFieldValue('modelFilename', undefined);
                  setFieldTouched('modelFile');
                  setFieldValue('modelFile', file);
                }}
                onReset={() => {
                  setFieldValue('modelFile', undefined);
                  if (initialValues.modelFilename) {
                    setFieldValue('coverFilename', initialValues.modelFilename);
                  }
                }}
                invalid={errors.modelFile && touched.modelFile}
                error={errors.modelFile}
              />
              {values.modelFilename && (
                <input type="text" name="modelFilename" onChange={handleChange} value={values.modelFilename} hidden />
              )}
              <ImageField
                title="Cover image file (.png)"
                id="coverFile"
                aspect={1}
                format="image/png"
                value={values.coverFile}
                onComplete={(file) => {
                  setFieldValue('coverFilename', undefined);
                  setFieldTouched('coverFile');
                  setFieldValue('coverFile', file);
                }}
                onReset={() => {
                  setFieldValue('coverFile', undefined);
                  if (initialValues.coverFilename) {
                    setFieldValue('coverFilename', initialValues.coverFilename);
                  }
                }}
                invalid={errors.coverFile && touched.coverFile}
                error={errors.coverFile}
              />
              {values.coverFilename && (
                <input type="text" name="coverFilename" onChange={handleChange} value={values.coverFilename} hidden />
              )}
            </div>
            <div className="card-footer">
              <button type="submit" className="btn btn-primary" disabled={loading} data-test="submit">Submit</button>
            </div>
          </form>
        )
      }
    </Formik>
  );
}

export default WorkForm;
