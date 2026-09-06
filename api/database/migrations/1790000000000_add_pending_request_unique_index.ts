import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.raw(
      "CREATE UNIQUE INDEX adoption_requests_pending_animal_email_unique ON adoption_requests (animal_id, lower(email)) WHERE status = 'pendente'"
    )
  }

  async down() {
    this.schema.raw('DROP INDEX adoption_requests_pending_animal_email_unique')
  }
}
