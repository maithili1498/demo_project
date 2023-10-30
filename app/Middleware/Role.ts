import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import { AccessControl, Query } from 'role-acl'

let ac = new AccessControl();

ac.grant('user').execute('get').on('users')
.grant('admin').execute('create').on('users')
.execute('get').on('users')


export default class Role {
  public async handle({auth, request}: HttpContextContract, next: () => Promise<void>) {
    let userPermission! : string
    const userEmail : string = auth.user.email
    // code for middleware goes here. ABOVE THE NEXT CALL
    let user = await Database.from('users')
    .where((Query) => {
      Query.where('email', userEmail)
    })

    if(user) {
      userPermission = user.role
    }
    await next()
  }
}
