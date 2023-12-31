// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
Cypress.Commands.add('login', (credentials) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/login',
    body: credentials,
  }).then(({ body }) => {
    localStorage.setItem('blogUser', JSON.stringify(body))
    cy.visit('http://localhost:5173')
  })
})

Cypress.Commands.add('logout', () => {
  localStorage.removeItem('blogUser')
})

Cypress.Commands.add('createBlog', (blog) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/blogs',
    body: blog,
    auth: {
      bearer: JSON.parse(localStorage.getItem('blogUser')).token
    }
  }).then(() => {
    cy.visit('http://localhost:5173')
  })
})
