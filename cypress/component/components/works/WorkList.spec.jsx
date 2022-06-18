import { MockedProvider } from '@apollo/client/testing';
import { mount } from '@cypress/react';
import faker from '@faker-js/faker';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import WorkList, { WORKS_QUERY } from '@/components/works/WorkList';

import 'admin-lte/dist/css/adminlte.min.css';
import '@/assets/css/custom.css';

const createWork = ({ id }) => ({
  id,
  title: faker.commerce.productName(),
  category: {
    id: faker.datatype.number(),
    name: faker.commerce.department()
  }
});

const createWorksMock = ({
  page,
  numWorks,
  firstId,
  hasNextPage
}) => ({
  request: {
    query: WORKS_QUERY,
    variables: {
      page
    }
  },
  result: {
    data: {
      works: {
        edges: [...Array(numWorks)]
          .map((_, i) => ({ node: createWork({ id: firstId - i }) })),
        pageInfo: {
          hasNextPage
        }
      }
    }
  }
});

describe('WorkList', () => {
  it('one page only', () => {
    const pageMock = createWorksMock({
      page: 1,
      numWorks: 5,
      firstId: 5,
      hasNextPage: false
    });

    mount(
      <MemoryRouter initialEntries={['/works']}>
        <MockedProvider
          mocks={[
            pageMock
          ]}
          addTypename={false}
        >
          <WorkList />
        </MockedProvider>
      </MemoryRouter>
    );
    cy.get('[data-test="paginationNumber"]').should('have.text', '1');
    cy.get('button[data-test="paginationPrevious"]').should('be.disabled');
    cy.get('button[data-test="paginationNext"]').should('be.disabled');
  });

  it('multiple pages', () => {
    const firstPageMock = createWorksMock({
      page: 1,
      numWorks: 10,
      firstId: 15,
      hasNextPage: true
    });
    const secondPageMock = createWorksMock({
      page: 2,
      numWorks: 5,
      firstId: 5,
      hasNextPage: false
    });

    mount(
      <MemoryRouter initialEntries={['/works']}>
        <MockedProvider
          mocks={[
            firstPageMock,
            secondPageMock,
            firstPageMock
          ]}
          addTypename={false}
        >
          <WorkList />
        </MockedProvider>
      </MemoryRouter>
    );

    cy.get('[data-test="paginationNumber"]').as('page').should('have.text', '1');
    cy.get('button[data-test="paginationPrevious"]').as('prev').should('be.disabled');
    cy.get('button[data-test="paginationNext"]').as('next').should('not.be.disabled');

    cy.get('@next').click();

    cy.get('@page').should('have.text', '2');
    cy.get('@prev').as('prev').should('not.be.disabled');
    cy.get('@next').as('next').should('be.disabled');

    cy.get('@prev').click();

    cy.get('@page').should('have.text', '1');
  });
});
