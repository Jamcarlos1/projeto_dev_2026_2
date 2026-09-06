import vine from '@vinejs/vine'


export const createAdoptionRequestValidator = vine.create({
  animalId: vine.number().positive(),
  nome: vine.string().trim().minLength(2).maxLength(150),
  email: vine.string().trim().email().maxLength(254),
  telefone: vine.string().trim().minLength(8).maxLength(30),
  dataVisita: vine.date({ formats: ['YYYY-MM-DD'] }),
  horarioVisita: vine.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  mensagem: vine.string().trim().optional(),
})
