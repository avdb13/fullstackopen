describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')

    const userOne = {
      username: 'test',
      name: 'Mister Cypress',
      password: 'cypress',
    }
    const userTwo = {
      username: 'jest',
      name: 'Miss Cypress',
      password: 'cypress',
    }

    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/users',
      body: userOne,
    })
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/users',
      body: userTwo,
    })

    cy.visit('http://localhost:5173')
  })

  it('login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('show login form')
  })

  describe('login', function () {
    it('fails with incorrect credentials', function () {
      cy.contains('show login form').click()
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'wrong credentials')
      cy.get('html').should('not.contain', 'Mister Cypress logged in')
    })

    it('succeeds with correct credentials', function () {
      cy.contains('show login form').click()
      cy.get('#username').type('test')
      cy.get('#password').type('cypress')
      cy.get('#login-button').click()

      cy.contains('Mister Cypress logged in')
    })

    describe('succeeds with correct credentials', function () {
      beforeEach(function () {
        cy.login({ username: 'test', password: 'cypress' })

        cy.createBlog({
          title: 'first',
          url: 'https://gnu.org',
          author: 'Richard M. Stallman',
        })
        cy.createBlog({
          title: 'second',
          url: 'https://fsf.org',
          author: 'Richard M. Stallman',
        })

        cy.logout()
        cy.login({ username: 'jest', password: 'cypress' })

        cy.createBlog({
          title: 'third',
          url: 'https://eff.org',
          author: 'Richard M. Stallman',
        })

        cy.logout()
        cy.login({ username: 'test', password: 'cypress' })
      })

      // it('a logged in user can create a blog', function () {
      //   cy.contains('create new blog').click()
      //   cy.get('#title').type('testing title')
      //   cy.get('#url').type('https://testingurl.com')
      //   cy.get('#author').type('testing author')

      //   // doesn't work since it conflicts with `create a blog`
      //   // cy.contains('create').click()
      //   cy.get('#create-button').click()

      //   cy.contains('testing title')
      // })

      // it('a logged in user can like a blog', function () {
      //   cy.contains('second').parent().as('blog')
      //   cy.get('@blog').contains('show').click()
      //   cy.get('@blog').contains('like').click()

      //   cy.contains('1 likes')
      // })

      // it('a logged in user can delete his own blogs', function () {
      //   cy.contains('first').parent().as('blog')
      //   cy.get('@blog').contains('show').click()
      //   cy.get('@blog').contains('remove').click()

      //   cy.get('html').should('not.contain', 'first')
      // })

      // it('a user can only delete his own blogs', function () {
      //   cy.contains('third').parent().as('blog')
      //   cy.get('@blog').contains('show').click()

      //   cy.get('@blog').should('not.contain', 'remove')
      // })

      it('posts are sorted by likes', function () {
        const originalOrder = ['first', 'second', 'third']
        cy.get('li').each(($li, i) =>
          cy.wrap($li).should('contain', originalOrder[i]),
        )

        cy.get('li').each(($li, i) => {
          cy.wrap($li).contains('show').click()
          cy.wrap($li).contains('like').as('likeButton')

          for (let j = 0; j < i + 1; j++) {
            cy.wrap($li).get('@likeButton').click()
            cy.wait(150)
          }
        })

        cy.get('li').each(($li, i) =>
          cy.wrap($li).should('contain', originalOrder.reverse()[i]),
        )
      })
    })
  })
})
