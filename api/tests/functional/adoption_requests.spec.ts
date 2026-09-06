import { test } from '@japa/runner'
import Animal from '#models/animal'
import User from '#models/user'
import AdoptionRequest from '#models/adoption_request'

async function createAnimal(overrides: Partial<Record<string, unknown>> = {}) {
  return Animal.create({
    titulo: 'Rex',
    especie: 'cachorro',
    idade: '3 anos',
    porte: 'medio',
    sexo: 'macho',
    ativa: true,
    ...overrides,
  })
}

const validPayload = (animalId: number) => ({
  animalId,
  nome: 'Maria Silva',
  email: 'maria@email.com',
  telefone: '31999999999',
  dataVisita: '2026-09-10',
  horarioVisita: '14:30',
  mensagem: 'Tenho um quintal grande',
})

test.group('Autenticação administrativa', () => {
  test('faz login com credenciais válidas', async ({ client, assert }) => {
    const admin = await User.create({ email: 'login@teste.com', password: 'senha123' })

    const response = await client.post('/api/v1/auth/login').json({
      email: admin.email,
      password: 'senha123',
    })

    response.assertStatus(200)
    assert.isString(response.body().data.token)
    response.assertBodyContains({ data: { user: { email: admin.email } } })
  })

  test('recusa credenciais inválidas', async ({ client }) => {
    await User.create({ email: 'login-invalido@teste.com', password: 'senha123' })

    const response = await client.post('/api/v1/auth/login').json({
      email: 'login-invalido@teste.com',
      password: 'senha-incorreta',
    })

    response.assertStatus(400)
  })

  test('encerra a sessão autenticada', async ({ client }) => {
    const admin = await User.create({ email: 'logout@teste.com', password: 'senha123' })

    const response = await client.post('/api/v1/account/logout').loginAs(admin)

    response.assertStatus(200)
  })
})

test.group('Adoption requests — fluxo público', () => {
  test('cria um pedido válido com status pendente', async ({ client, assert }) => {
    const animal = await createAnimal()

    const response = await client.post('/api/v1/adoption-requests').json(validPayload(animal.id))

    response.assertStatus(201)
    response.assertBodyContains({ status: 'pendente', nome: 'Maria Silva' })

    assert.isNotNull(await AdoptionRequest.findBy('email', 'maria@email.com'))
  })

  test('recusa um pedido com dados inválidos e não persiste nada', async ({ client, assert }) => {
    const animal = await createAnimal()

    const response = await client.post('/api/v1/adoption-requests').json({
      animalId: animal.id,
      nome: 'X',
      email: 'nao-e-um-email',
      telefone: '31999999999',
      dataVisita: '2026-09-10',
      horarioVisita: '14:30',
    })

    response.assertStatus(422)

    const count = await AdoptionRequest.query().where('animalId', animal.id).count('* as total')
    assert.equal(Number(count[0].$extras.total), 0)
  })

  test('recusa pedido para animal inativo', async ({ client }) => {
    const animal = await createAnimal({ ativa: false })

    const response = await client.post('/api/v1/adoption-requests').json(validPayload(animal.id))

    response.assertStatus(422)
    response.assertBodyContains({ error: 'Este animal não está mais disponível para adoção.' })
  })

  test('recusa pedido pendente duplicado para o mesmo animal e e-mail', async ({ client }) => {
    const animal = await createAnimal()

    const firstResponse = await client
      .post('/api/v1/adoption-requests')
      .json(validPayload(animal.id))
    firstResponse.assertStatus(201)

    const duplicateResponse = await client
      .post('/api/v1/adoption-requests')
      .json(validPayload(animal.id))

    duplicateResponse.assertStatus(422)
    duplicateResponse.assertBodyContains({
      error: 'Já existe um pedido pendente para este animal com este e-mail.',
    })
  })
})

test.group('Adoption requests — painel administrativo', () => {
  test('barra o acesso ao painel sem autenticação', async ({ client }) => {
    const response = await client.get('/api/v1/admin/adoption-requests')
    response.assertStatus(401)
  })

  test('permite acesso ao painel com token válido', async ({ client }) => {
    const admin = await User.create({ email: 'admin@teste.com', password: 'senha123' })

    const response = await client.get('/api/v1/admin/adoption-requests').loginAs(admin)

    response.assertStatus(200)
  })

  test('confirma um pedido pendente e muda seu status', async ({ client, assert }) => {
    const admin = await User.create({ email: 'admin2@teste.com', password: 'senha123' })
    const animal = await createAnimal()
    const pedido = await AdoptionRequest.create({
      animalId: animal.id,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '31999999999',
      dataVisita: '2026-09-10' as unknown as never,
      horarioVisita: '14:30',
      status: 'pendente',
    })

    const response = await client
      .patch(`/api/v1/admin/adoption-requests/${pedido.id}/confirm`)
      .loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'confirmado' })

    await pedido.refresh()
    assert.equal(pedido.status, 'confirmado')
  })

  test('confirmar um pedido inativa o animal e cancela os demais pedidos pendentes dele (RN04/RN05)', async ({
    client,
    assert,
  }) => {
    const admin = await User.create({ email: 'admin3@teste.com', password: 'senha123' })
    const animal = await createAnimal()

    const pedidoMaria = await AdoptionRequest.create({
      animalId: animal.id,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '31999999999',
      dataVisita: '2026-09-10' as unknown as never,
      horarioVisita: '14:30',
      status: 'pendente',
    })

    const pedidoJoao = await AdoptionRequest.create({
      animalId: animal.id,
      nome: 'Joao Pedro',
      email: 'joao@email.com',
      telefone: '31988888888',
      dataVisita: '2026-09-11' as unknown as never,
      horarioVisita: '10:00',
      status: 'pendente',
    })

    const confirmResponse = await client
      .patch(`/api/v1/admin/adoption-requests/${pedidoMaria.id}/confirm`)
      .loginAs(admin)
    confirmResponse.assertStatus(200)

    await animal.refresh()
    assert.isFalse(animal.ativa)

    await pedidoJoao.refresh()
    assert.equal(pedidoJoao.status, 'cancelado')
    assert.isNotNull(pedidoJoao.motivoCancelamento)
  })

  test('não permite confirmar um pedido que já foi confirmado antes', async ({ client }) => {
    const admin = await User.create({ email: 'admin4@teste.com', password: 'senha123' })
    const animal = await createAnimal()
    const pedido = await AdoptionRequest.create({
      animalId: animal.id,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '31999999999',
      dataVisita: '2026-09-10' as unknown as never,
      horarioVisita: '14:30',
      status: 'confirmado',
    })

    const response = await client
      .patch(`/api/v1/admin/adoption-requests/${pedido.id}/confirm`)
      .loginAs(admin)

    response.assertStatus(422)
  })

  test('cancela um pedido pendente', async ({ client, assert }) => {
    const admin = await User.create({ email: 'cancelar@teste.com', password: 'senha123' })
    const animal = await createAnimal()
    const pedido = await AdoptionRequest.create({
      animalId: animal.id,
      nome: 'Maria Silva',
      email: 'maria-cancelar@email.com',
      telefone: '31999999999',
      dataVisita: '2026-09-10' as unknown as never,
      horarioVisita: '14:30',
      status: 'pendente',
    })

    const response = await client
      .patch(`/api/v1/admin/adoption-requests/${pedido.id}/cancel`)
      .json({ motivo: 'Solicitante desistiu.' })
      .loginAs(admin)

    response.assertStatus(200)
    await pedido.refresh()
    assert.equal(pedido.status, 'cancelado')
    assert.equal(pedido.motivoCancelamento, 'Solicitante desistiu.')
  })

  test('retorna resumo e exporta pedidos filtrados', async ({ client, assert }) => {
    const admin = await User.create({ email: 'relatorio@teste.com', password: 'senha123' })
    const beforeSummaryResponse = await client
      .get('/api/v1/admin/adoption-requests/summary')
      .loginAs(admin)
    const beforeSummary = beforeSummaryResponse.body()
    const animal = await createAnimal()
    await AdoptionRequest.create({
      animalId: animal.id,
      nome: 'Maria Silva',
      email: 'maria-relatorio@email.com',
      telefone: '31999999999',
      dataVisita: '2026-09-10' as unknown as never,
      horarioVisita: '14:30',
      status: 'pendente',
    })
    await AdoptionRequest.create({
      animalId: animal.id,
      nome: 'Joao Pedro',
      email: 'joao-relatorio@email.com',
      telefone: '31988888888',
      dataVisita: '2026-09-11' as unknown as never,
      horarioVisita: '10:00',
      status: 'cancelado',
    })

    const summaryResponse = await client
      .get('/api/v1/admin/adoption-requests/summary')
      .loginAs(admin)
    summaryResponse.assertStatus(200)
    assert.equal(summaryResponse.body().pendentes, beforeSummary.pendentes + 1)
    assert.equal(summaryResponse.body().cancelados, beforeSummary.cancelados + 1)
    assert.equal(summaryResponse.body().animaisDisponiveis, beforeSummary.animaisDisponiveis + 1)

    const exportResponse = await client
      .get('/api/v1/admin/adoption-requests/export?status=pendente&search=Maria')
      .loginAs(admin)
    exportResponse.assertStatus(200)
    assert.include(exportResponse.text(), 'Maria Silva')
    assert.notInclude(exportResponse.text(), 'Joao Pedro')
  })

  test('gerencia animais pelo painel', async ({ client, assert }) => {
    const admin = await User.create({ email: 'animais@teste.com', password: 'senha123' })

    const createResponse = await client
      .post('/api/v1/admin/animals')
      .json({
        titulo: 'Luna',
        especie: 'gato',
        idade: '2 anos',
        porte: 'pequeno',
        sexo: 'femea',
        descricao: 'Carinhosa',
      })
      .loginAs(admin)

    createResponse.assertStatus(201)
    const createdAnimal = createResponse.body() as { id: number }
    const animalId = createdAnimal.id

    const updateResponse = await client
      .patch(`/api/v1/admin/animals/${animalId}`)
      .json({ ativa: false })
      .loginAs(admin)
    updateResponse.assertStatus(200)
    const updatedAnimal = updateResponse.body() as { ativa: boolean }
    assert.isFalse(updatedAnimal.ativa)

    const deleteResponse = await client.delete(`/api/v1/admin/animals/${animalId}`).loginAs(admin)
    deleteResponse.assertStatus(204)
  })

  test('impede excluir animal que possui pedidos vinculados', async ({ client }) => {
    const admin = await User.create({ email: 'integridade@teste.com', password: 'senha123' })
    const animal = await createAnimal()
    await AdoptionRequest.create({
      animalId: animal.id,
      nome: 'Maria Silva',
      email: 'maria-integridade@email.com',
      telefone: '31999999999',
      dataVisita: '2026-09-10' as unknown as never,
      horarioVisita: '14:30',
      status: 'pendente',
    })

    const response = await client.delete(`/api/v1/admin/animals/${animal.id}`).loginAs(admin)

    response.assertStatus(409)
  })
})
