import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Animal from '#models/animal'


export default class extends BaseSeeder {
  async run() {
    await Animal.updateOrCreateMany('titulo', [
      {
        titulo: 'Thor',
        especie: 'cachorro',
        idade: '2 anos',
        porte: 'medio',
        sexo: 'macho',
        descricao: 'Brincalhão, adora quintal e já sabe sentar e dar a pata.',
        fotoUrl: 'https://clubepets.com.br/wp-content/uploads/2024/04/cp3.png',
        ativa: true,
      },
      {
        titulo: 'Mimi',
        especie: 'gato',
        idade: '1 ano',
        porte: 'pequeno',
        sexo: 'femea',
        descricao: 'Independente e carinhosa nas horas certas. Ótima para apartamento.',
        fotoUrl: 'https://chemitec.com.br/wp-content/uploads/2020/01/gato-300x251.jpg.webp',
        ativa: true,
      },
      {
        titulo: 'Bolt',
        especie: 'cachorro',
        idade: '6 meses',
        porte: 'pequeno',
        sexo: 'macho',
        descricao: 'Filhote cheio de energia, precisa de espaço para correr.',
        fotoUrl: 'https://fisiocarepet.com.br/wp-content/uploads/2025/11/Capas-para-blog-63.jpg',
        ativa: true,
      },
    ])
  }
}