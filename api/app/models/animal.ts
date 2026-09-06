import { AnimalSchema } from '#database/schema'
import { column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import AdoptionRequest from '#models/adoption_request'

export default class Animal extends AnimalSchema {
  
  
  
  @column({ consume: (value: number | boolean) => Boolean(value) })
  declare ativa: boolean

  @hasMany(() => AdoptionRequest)
  declare adoptionRequests: HasMany<typeof AdoptionRequest>
}
