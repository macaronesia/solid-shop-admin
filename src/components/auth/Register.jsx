import {
  gql,
  useApolloClient,
  useMutation
} from '@apollo/client';
import React from 'react';
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import AuthForm from '@/components/auth/AuthForm';
import { saveAuthData } from '@/core/auth';
import { alertMessage } from '@/utils/alert';

export const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password, isSuperuser: true) {
      accessToken
      user {
        username
      }
    }
  }
`;

function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const client = useApolloClient();

  const [register, { loading }] = useMutation(REGISTER_MUTATION);

  const initialValues = {
    username: '',
    password: ''
  };
  const onSubmit = async (values) => {
    try {
      const { data } = await register({ variables: values });
      saveAuthData(client, {
        accessToken: data.register.accessToken,
        user: data.register.user
      });
      navigate(location.state && location.state.from ? location.state.from.pathname : '/', { replace: true });
    } catch (e) {
      if (e.graphQLErrors && e.graphQLErrors.length) {
        switch (e.graphQLErrors[0].message) {
          case 'conflict':
            alertMessage('That username is taken. Try another.');
            break;
          default:
        }
      }
    }
  };
  return (
    <div className="login-page" data-set="register-page">
      <div className="login-box">
        <div className="login-logo">
          <b>SOLID SHOP</b>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Register a new admin user account</p>
            <AuthForm
              initialValues={initialValues}
              onSubmit={onSubmit}
              loading={loading}
              authType="register"
            />
            <p className="mb-0">
              <Link
                to="/login"
                {...{
                  ...(location.state && location.state.from
                    ? { state: { from: location.state.from } } : {})
                }}
                data-test="entry"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
