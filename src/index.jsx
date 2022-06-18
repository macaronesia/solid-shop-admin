import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  from,
  InMemoryCache
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import RootContainer from '@/components/RootContainer';
import {
  HTTP_LINK_URL
} from '@/constants/environmentConstants';
import {
  clearAuthData,
  getAuthToken,
  loadAuthData
} from '@/core/auth';
import { alertMessage } from '@/utils/alert';

import 'admin-lte/plugins/fontawesome-free/css/all.min.css';
import 'admin-lte/dist/css/adminlte.min.css';
import 'react-image-crop/dist/ReactCrop.css';
import '@/assets/css/custom.css';

let client;

const httpLink = createUploadLink({
  uri: HTTP_LINK_URL
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const context = operation.getContext();
  if (context.authRequired) {
    const accessToken = getAuthToken(client);
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'authorization': `Bearer ${accessToken}`
      }
    }));
  }
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    if (['UNAUTHENTICATED', 'FORBIDDEN'].includes(graphQLErrors[0].extensions.code)) {
      clearAuthData(client)
        .then(() => {
          window.location.href = '#';
        });
    }
  }
  if (networkError && networkError.name !== 'ServerError') {
    alertMessage('Network error');
  }
});

const cache = new InMemoryCache();

client = new ApolloClient({
  link: from([
    errorLink,
    authMiddleware,
    httpLink
  ]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache'
    },
    query: {
      fetchPolicy: 'no-cache'
    }
  }
});

loadAuthData(client);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <HashRouter>
    <ApolloProvider client={client}>
      <RootContainer />
    </ApolloProvider>
  </HashRouter>
);
