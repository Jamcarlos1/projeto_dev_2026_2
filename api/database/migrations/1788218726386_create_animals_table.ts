import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'animals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.string('titulo', 120).notNullable()
      table.enum('especie', ['cachorro', 'gato', 'outro']).notNullable()
      table.string('idade', 40).notNullable()
      table.enum('porte', ['pequeno', 'medio', 'grande']).notNullable()
      table.enum('sexo', ['macho', 'femea']).notNullable()
      table.text('descricao').nullable()
      table.string('foto_url').nullable()
      table.boolean('ativa').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}