import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import Role from 'App/Models/Role'

export default class Admin {
  public async handle({request, auth}: HttpContextContract, next: () => Promise<void>) {

    const user = await auth.authenticate()
    const role_id = user.$attributes.role_id
   
    const roles = await Role.find(role_id)

    if(roles?.$attributes.roles != "admin") {
      throw new Error("Only admin has the rights to view all/delete the users");
      
    }

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
