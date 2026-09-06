import vine from '@vinejs/vine'

const especie = () => vine.enum(['cachorro', 'gato', 'outro'] as const)
const porte = () => vine.enum(['pequeno', 'medio', 'grande'] as const)
const sexo = () => vine.enum(['macho', 'femea'] as const)


export const createAnimalValidator = vine.create({
  titulo: vine.string().trim().minLength(2).maxLength(120),
  especie: especie(),
  idade: vine.string().trim().minLength(1).maxLength(40),
  porte: porte(),
  sexo: sexo(),
  descricao: vine.string().trim().optional(),
  fotoUrl: vine.string().trim().url().optional(),
})


export const updateAnimalValidator = vine.create({
  titulo: vine.string().trim().minLength(2).maxLength(120).optional(),
  especie: especie().optional(),
  idade: vine.string().trim().minLength(1).maxLength(40).optional(),
  porte: porte().optional(),
  sexo: sexo().optional(),
  descricao: vine.string().trim().optional(),
  fotoUrl: vine.string().trim().url().optional(),
  ativa: vine.boolean().optional(),
})
