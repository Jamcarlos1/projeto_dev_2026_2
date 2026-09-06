import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import AdoptionRequest from '#models/adoption_request'
import Animal from '#models/animal'
import { createAdoptionRequestValidator } from '#validators/adoption_request'

const requestStatuses = ['pendente', 'confirmado', 'cancelado'] as const
type RequestStatus = (typeof requestStatuses)[number]

function isRequestStatus(value: unknown): value is RequestStatus {
  return typeof value === 'string' && requestStatuses.includes(value as RequestStatus)
}

export default class AdoptionRequestsController {
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createAdoptionRequestValidator)

    const animal = await Animal.find(data.animalId)

    if (!animal || !animal.ativa) {
      return response.unprocessableEntity({
        error: 'Este animal não está mais disponível para adoção.',
      })
    }

    const duplicate = await AdoptionRequest.query()
      .where('animalId', data.animalId)
      .whereILike('email', data.email)
      .where('status', 'pendente')
      .first()

    if (duplicate) {
      return response.unprocessableEntity({
        error: 'Já existe um pedido pendente para este animal com este e-mail.',
      })
    }

    let adoptionRequest: AdoptionRequest
    try {
      adoptionRequest = await AdoptionRequest.create({
        animalId: data.animalId,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        dataVisita: data.dataVisita,
        horarioVisita: data.horarioVisita,
        mensagem: data.mensagem ?? null,
        status: 'pendente',
      })
    } catch (error) {
      if (this.isPendingRequestUniqueViolation(error)) {
        return response.unprocessableEntity({
          error: 'Já existe um pedido pendente para este animal com este e-mail.',
        })
      }

      throw error
    }

    return response.created(adoptionRequest)
  }

  async index({ request, response }: HttpContext) {
    const rawStatus = request.input('status')
    const rawPage = request.input('page', 1)
    const rawPerPage = request.input('perPage', 10)
    const search = request.input('search')

    if (rawStatus !== undefined && !isRequestStatus(rawStatus)) {
      return response.unprocessableEntity({ error: 'Status de pedido inválido.' })
    }

    const page = Number(rawPage)
    const perPage = Number(rawPerPage)
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(perPage) ||
      perPage < 1 ||
      perPage > 50
    ) {
      return response.unprocessableEntity({
        error: 'Página deve ser positiva e o limite deve estar entre 1 e 50.',
      })
    }

    const status = rawStatus as RequestStatus | undefined

    const query = AdoptionRequest.query().preload('animal').orderBy('createdAt', 'desc')

    if (status) {
      query.where('status', status)
    }

    if (search) {
      query.where((builder) => {
        builder.whereILike('nome', `%${search}%`).orWhereILike('email', `%${search}%`)
      })
    }

    return query.paginate(page, perPage)
  }

  async summary({ response }: HttpContext) {
    const [pending, confirmed, canceled, availableAnimals] = await Promise.all([
      AdoptionRequest.query().where('status', 'pendente').count('* as total'),
      AdoptionRequest.query().where('status', 'confirmado').count('* as total'),
      AdoptionRequest.query().where('status', 'cancelado').count('* as total'),
      Animal.query().where('ativa', true).count('* as total'),
    ])

    return response.ok({
      pendentes: Number(pending[0].$extras.total),
      confirmados: Number(confirmed[0].$extras.total),
      cancelados: Number(canceled[0].$extras.total),
      animaisDisponiveis: Number(availableAnimals[0].$extras.total),
    })
  }

  async export({ request, response }: HttpContext) {
    const rawStatus = request.input('status')
    const search = request.input('search')

    if (rawStatus !== undefined && !isRequestStatus(rawStatus)) {
      return response.unprocessableEntity({ error: 'Status de pedido inválido.' })
    }

    const query = AdoptionRequest.query().preload('animal').orderBy('createdAt', 'desc')
    const status = rawStatus as RequestStatus | undefined

    if (status) query.where('status', status)
    if (search) {
      query.where((builder) => {
        builder.whereILike('nome', `%${search}%`).orWhereILike('email', `%${search}%`)
      })
    }

    const requests = await query
    const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`
    const rows = requests.map((item) =>
      [
        item.id,
        item.nome,
        item.email,
        item.telefone,
        item.animal?.titulo ?? `#${item.animalId}`,
        item.dataVisita.toISODate(),
        item.horarioVisita,
        item.status,
        item.mensagem,
      ]
        .map(escape)
        .join(',')
    )

    const csv = [
      '\uFEFFid,nome,email,telefone,animal,data_visita,horario,status,mensagem',
      ...rows,
    ].join('\r\n')

    return response
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', 'attachment; filename="pedidos-adocao.csv"')
      .send(csv)
  }

  async confirm({ params, response }: HttpContext) {
    const result = await db.transaction(async (trx) => {
      const adoptionRequest = await AdoptionRequest.findOrFail(params.id, { client: trx })

      if (adoptionRequest.status !== 'pendente') {
        return { error: 'Só é possível confirmar um pedido que ainda está pendente.' as const }
      }

      adoptionRequest.useTransaction(trx)
      adoptionRequest.status = 'confirmado'
      await adoptionRequest.save()

      const animal = await Animal.findOrFail(adoptionRequest.animalId, { client: trx })
      animal.useTransaction(trx)
      animal.ativa = false
      await animal.save()

      const outrosPendentes = await AdoptionRequest.query({ client: trx })
        .where('animalId', animal.id)
        .where('status', 'pendente')
        .whereNot('id', adoptionRequest.id)

      for (const outro of outrosPendentes) {
        outro.useTransaction(trx)
        outro.status = 'cancelado'
        outro.motivoCancelamento = 'Animal já foi adotado por outro pedido.'
        await outro.save()
      }

      return { adoptionRequest }
    })

    if ('error' in result) {
      return response.unprocessableEntity({ error: result.error })
    }

    return result.adoptionRequest
  }

  async cancel({ params, request, response }: HttpContext) {
    const adoptionRequest = await AdoptionRequest.findOrFail(params.id)

    if (adoptionRequest.status !== 'pendente') {
      return response.unprocessableEntity({
        error: 'Só é possível cancelar um pedido que ainda está pendente.',
      })
    }

    adoptionRequest.status = 'cancelado'
    adoptionRequest.motivoCancelamento = request.input('motivo', null)
    await adoptionRequest.save()

    return adoptionRequest
  }

  private isPendingRequestUniqueViolation(error: unknown) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'SQLITE_CONSTRAINT_UNIQUE'
    )
  }
}
