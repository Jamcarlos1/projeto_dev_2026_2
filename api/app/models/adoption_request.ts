import { AdoptionRequestSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Animal from '#models/animal'

export default class AdoptionRequest extends AdoptionRequestSchema {
  @belongsTo(() => Animal)
  declare animal: BelongsTo<typeof Animal>
}
