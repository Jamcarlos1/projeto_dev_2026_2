

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    
    
    
    router
      .group(() => {
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    
    router.get('animals', [controllers.Animals, 'index'])
    router.post('adoption-requests', [controllers.AdoptionRequests, 'store'])

    
    router
      .group(() => {
        router.get('adoption-requests', [controllers.AdoptionRequests, 'index'])
        router.get('adoption-requests/summary', [controllers.AdoptionRequests, 'summary'])
        router.get('adoption-requests/export', [controllers.AdoptionRequests, 'export'])
        router.patch('adoption-requests/:id/confirm', [controllers.AdoptionRequests, 'confirm'])
        router.patch('adoption-requests/:id/cancel', [controllers.AdoptionRequests, 'cancel'])

        router.get('animals', [controllers.Animals, 'adminIndex'])
        router.post('animals', [controllers.Animals, 'store'])
        router.patch('animals/:id', [controllers.Animals, 'update'])
        router.delete('animals/:id', [controllers.Animals, 'destroy'])
      })
      .prefix('admin')
      .as('admin')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
