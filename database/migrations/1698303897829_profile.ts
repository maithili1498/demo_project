import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Profile extends BaseSchema {
  protected tableName = 'profiles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').references('users.id')
      .onDelete('CASCADE')
      table.string("first_name", 255).notNullable()
      table.string("last_name", 255).notNullable()
      table.string("dob", 255).notNullable()
      table.string("role", 255).notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
