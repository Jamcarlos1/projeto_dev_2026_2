import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'adoption_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table
        .integer('animal_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('animals')
        .onDelete('RESTRICT')

      table.string('nome', 150).notNullable()
      table.string('email', 254).notNullable()
      table.string('telefone', 30).notNullable()
      table.date('data_visita').notNullable()
      table.time('horario_visita').notNullable()
      table.text('mensagem').nullable()

      table.enum('status', ['pendente', 'confirmado', 'cancelado']).notNullable().defaultTo('pendente')
      table.string('motivo_cancelamento').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}