/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'

Event.on('new:user', (user) => {
  console.log('Registered new User: ', user.$attributes.username)
})

