import type { HttpContext } from '@adonisjs/core/http'
import Animal from '#models/animal'
import { createAnimalValidator, updateAnimalValidator } from '#validators/animal'

const species = ['cachorro', 'gato', 'outro'] as const

export default class AnimalsController {
  
  async index({ request, response }: HttpContext) {
    const especie = request.input('especie')

    if (especie !== undefined && !species.includes(especie)) {
      return response.unprocessableEntity({ error: 'Espécie inválida.' })
    }

    const query = Animal.query().where('ativa', true).orderBy('createdAt', 'desc')

    if (especie) {
      query.where('especie', especie)
    }

    return query
  }

  
  async adminIndex() {
    return Animal.query().orderBy('createdAt', 'desc')
  }

  
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createAnimalValidator)

    const animal = await Animal.create({
      titulo: data.titulo,
      especie: data.especie,
      idade: data.idade,
      porte: data.porte,
      sexo: data.sexo,
      descricao: data.descricao ?? null,
      fotoUrl: data.fotoUrl ?? null,
      ativa: true,
    })

    return response.created(animal)
  }

  
  async update({ params, request }: HttpContext) {
    const animal = await Animal.findOrFail(params.id)
    const data = await request.validateUsing(updateAnimalValidator)

    animal.merge({
      ...(data.titulo !== undefined && { titulo: data.titulo }),
      ...(data.especie !== undefined && { especie: data.especie }),
      ...(data.idade !== undefined && { idade: data.idade }),
      ...(data.porte !== undefined && { porte: data.porte }),
      ...(data.sexo !== undefined && { sexo: data.sexo }),
      ...(data.descricao !== undefined && { descricao: data.descricao }),
      ...(data.fotoUrl !== undefined && { fotoUrl: data.fotoUrl }),
      ...(data.ativa !== undefined && { ativa: data.ativa }),
    })

    await animal.save()

    return animal
  }

  
  async destroy({ params, response }: HttpContext) {
    const animal = await Animal.findOrFail(params.id)
    await animal.load('adoptionRequests')

    if (animal.adoptionRequests.length > 0) {
      return response.conflict({
        error:
          'Este animal já tem pedidos de adoção associados e não pode ser excluído. Desative-o em vez disso.',
      })
    }

    await animal.delete()

    return response.noContent()
  }
}
