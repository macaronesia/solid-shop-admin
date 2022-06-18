import faker from '@faker-js/faker';

const user = {
  username: 'admin',
  password: 'password'
};
const token = 'token';

const interceptCategoriesQuery = ({ alias }) => {
  const chain = cy.intercept('/graphql', { method: 'POST', times: 1 }, (req) => {
    expect(req.body).to.have.property('operationName', 'Categories');
    req.reply({ data: { categories: { edges: [] } } });
  });
  if (alias != null) {
    chain.as(alias);
  }
};

const startWithPersistentToken = () => {
  interceptCategoriesQuery({ alias: 'categories' });
  cy.visit('/', {
    onBeforeLoad: (window) => {
      window.localStorage.setItem('authorized', '1');
      window.localStorage.setItem('username', user.username);
      window.localStorage.setItem('accessToken', token);
    }
  });
  cy.wait(['@categories']);
  cy.get('[data-test="username"]').contains(user.username);
  cy.hash().should('eq', '#/categories');
};

describe('displays request errors', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.hash().should('eq', '#/login');
  });

  it('displays a network error', () => {
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.intercept('/graphql', { method: 'POST', times: 1 }, (req) => {
      req.reply({ forceNetworkError: true });
    });
    cy.get('[data-test="submit"]').click();
    cy.get('[role="dialog"] #swal2-html-container').contains('Network error');
    cy.get('[role="dialog"] .swal2-confirm').click();
  });

  it('displays a response error', () => {
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.intercept('/graphql', { method: 'POST', times: 1 }, (req) => {
      expect(req.body).to.have.property('operationName', 'Login');
      expect(req.body).to.have.property('variables').to.deep.include({
        username: user.username,
        password: user.password
      });
      req.reply({
        errors: [
          {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
            message: 'user_not_found'
          }
        ]
      });
    });
    cy.get('[data-test="submit"]').click();
    cy.get('[role="dialog"] #swal2-html-container').contains('That account doesn\'t exist.');
    cy.get('[role="dialog"] .swal2-confirm').click();
  });
});

describe('auth', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.hash().should('eq', '#/login');
  });

  it('register a new user -> get to the home page -> logout', () => {
    cy.get('[data-test="entry"]').click();
    cy.hash().should('eq', '#/register');

    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);

    interceptCategoriesQuery({ alias: 'categories' });

    cy.intercept('/graphql', { method: 'POST', times: 1 }, (req) => {
      expect(req.body).to.have.property('operationName', 'Register');
      expect(req.body).to.have.property('variables').to.deep.include({
        username: user.username,
        password: user.password
      });
      req.reply({
        data: {
          register: {
            accessToken: token,
            user: {
              username: user.username
            }
          }
        }
      });
    });

    cy.get('[data-test="submit"]').click();

    cy.wait(['@categories']).then(() => {
      expect(localStorage.getItem('authorized')).to.eq('1');
      expect(localStorage.getItem('username')).to.eq(user.username);
      expect(localStorage.getItem('accessToken')).to.eq(token);
    });
    cy.get('[data-test="username"]').contains(user.username);
    cy.hash().should('eq', '#/categories');

    cy.get('[data-test="username"]').click();
    cy.get('[data-test="logout"]').click();
    cy.hash().should('eq', '#/login').then(() => {
      expect(localStorage.getItem('authorized')).to.eq('');
      expect(localStorage.getItem('username')).to.eq('');
      expect(localStorage.getItem('accessToken')).to.eq('');
    });
  });
});

describe('token', () => {
  beforeEach(() => {
    startWithPersistentToken();
  });

  it('token expired', () => {
    cy.get('[data-test="create"]').click();
    cy.hash().should('eq', '#/categories/create');

    cy.get('input[name="name"]').type(faker.commerce.department());

    cy.intercept('/graphql', { method: 'POST', times: 1 }, (req) => {
      expect(req.headers).to.have.property('authorization');
      req.reply({
        errors: [
          {
            extensions: { code: 'UNAUTHENTICATED' },
            message: 'jwt_decode_error'
          }
        ]
      });
    });

    cy.get('[data-test="submit"]').click();

    cy.hash().should('eq', '#/login').then(() => {
      expect(localStorage.getItem('authorized')).to.eq('');
      expect(localStorage.getItem('username')).to.eq('');
      expect(localStorage.getItem('accessToken')).to.eq('');
    });
  });
});
