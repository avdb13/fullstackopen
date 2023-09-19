describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')
    const user = {
      username: 'test',
      name: 'Mister Cypress',
      password: 'cypress'
    }

    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/users',
      body: user,
    })
    localStorage.removeItem('BlogAppUser')
    cy.visit('http://localhost:5173')
  })

  it('login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('show login form')
  })

  describe('login', function() {
    it('fails with incorrect credentials', function() {
      cy.contains('show login form').click()
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong credentials')
    })

    it('succeeds with correct credentials', function() {
      cy.contains('show login form').click()
      cy.get('#username').type('test')
      cy.get('#password').type('cypress')
      cy.get('#login-button').click()
    })
  })
})
