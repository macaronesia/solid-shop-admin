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

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password, superuserRequired: true) {
      accessToken
      user {
        username
      }
    }
  }
`;

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const client = useApolloClient();

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const initialValues = {
    username: '',
    password: ''
  };
  const onSubmit = async (values, actions) => {
    try {
      const { data } = await login({ variables: values });
      saveAuthData(client, {
        accessToken: data.login.accessToken,
        user: data.login.user
      });
      navigate(location.state && location.state.from ? location.state.from.pathname : '/', { replace: true });
    } catch (e) {
      if (e.graphQLErrors && e.graphQLErrors.length) {
        switch (e.graphQLErrors[0].message) {
          case 'user_not_found':
            alertMessage('That account doesn\'t exist.');
            break;
          case 'password_incorrect':
            actions.setFieldValue('password', '', false);
            actions.setTouched({ password: false });
            alertMessage('That password is incorrect.');
            break;
          case 'not_superuser':
            alertMessage('You should have superuser privileges to sign in.');
            break;
          default:
        }
      }
    }
  };
  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <b>SOLID SHOP</b>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Sign in to start your session</p>
            <AuthForm
              initialValues={initialValues}
              onSubmit={onSubmit}
              loading={loading}
              authType="login"
            />
            <p className="mb-0">
              <Link
                to="/register"
                {...{
                  ...(location.state && location.state.from
                    ? { state: { from: location.state.from } } : {})
                }}
                data-test="entry"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
