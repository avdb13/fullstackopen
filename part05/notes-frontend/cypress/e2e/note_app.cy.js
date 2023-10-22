describe('Note app', () => {
  beforeEach(() => {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Misaka Mikoto',
      username: 'misaka',
      password: 'passwd'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

    cy.visit('http://localhost:8080')
  })

  it('front page can be opened', () => {
    cy.contains('Notes')
    cy.contains('Note app, department of bad engineering, university of dummies 2023')
  })

  // it.only('login fails with the wrong password', () => {
  //   cy.contains('login').click()
  //   cy.get('#username').type('misaka')
  //   cy.get('#password').type('wrong')
  //   cy.get('#login-button').click()

  //   cy.get('.error')
  //     .should('contain', 'wrong credentials')
  //     .and('have.css', 'color', 'rgb(245, 245, 245)')
  //     .and('have.css', 'border-style', 'solid')
  //   cy
  //     .contains('Misaka Mikoto logged in').should('not.exist')
  // })

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'misaka', password: 'passwd' })
    })

    describe('and a note exists', () => {
      beforeEach(() => {
        cy.createNote({ content: 'another cypress note', important: false })
        cy.createNote({ content: 'second', important: false })
        cy.createNote({ content: 'third', important: false })
      })

      it('it can be made important', () => {
        cy.contains('second').parent().find('button').as('theButton')
        cy.get('@theButton').click()
        cy.get('@theButton').should('contain','unimportant')
      })

      it('then example', () => {
        cy.get('button').then(buttons => {
          console.log('number of buttons', buttons.length)
          cy.wrap(buttons[0]).click()
        })
      })
    })
  })
})
