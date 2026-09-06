# Decisões do projeto

## Tema e stack

Optamos por um domínio de adoção de animais por permitir demonstrar, com um fluxo compreensível, os quatro pilares exigidos: catálogo de opções, formulário público, persistência com status e gestão administrativa. Para o frontend, escolhemos React com Vite e Material UI, priorizando velocidade de construção de uma SPA responsiva com componentes prontos e testados. Para o backend, escolhemos AdonisJS com Lucid ORM, que integra validação, migrations e autenticação sem depender de bibliotecas externas adicionais.

Utilizamos SQLite como banco de dados para eliminar a necessidade de configuração de um servidor externo, priorizando a portabilidade do projeto sobre a escalabilidade — decisão adequada ao escopo e volume deste teste, mas que trocaríamos por Postgres num cenário de produção real.

Para autenticação, utilizamos access tokens Bearer nativos do AdonisJS em vez de JWT. Essa escolha reduz código de assinatura e validação próprios e mantém os tokens revogáveis diretamente pelo servidor, sem necessidade de lista de revogação separada.

O campo de foto do animal aceita apenas URL externa, sem upload de arquivo. Implementar upload exigiria armazenamento, processamento de imagem e uma superfície de segurança adicional que consideramos fora do núcleo avaliado neste teste.

## Regras de negócio e casos-limite

- Todo pedido de adoção nasce com status `pendente`; dados inválidos e pedidos para animais inativos são rejeitados antes da persistência, com mensagens de erro específicas.
- Ao confirmar um pedido, o animal correspondente é automaticamente marcado como indisponível, e os demais pedidos pendentes para o mesmo animal são cancelados em cascata — preservando o histórico em vez de simplesmente excluí-los.
- Pedidos confirmados ou cancelados são estados finais e não podem ser reabertos pela interface, evitando inconsistência de status.
- Animais com pedidos vinculados não podem ser removidos fisicamente; a ação disponível nesse caso é a desativação, para preservar a integridade referencial do histórico.
- O painel administrativo trata explicitamente os estados de carregamento, erro de rede e lista vazia, além de validar os parâmetros de filtro e paginação recebidos.
- Na página pública, a lista de animais permanece visível durante a troca de filtro em vez de ser substituída por um estado de carregamento — evita o efeito de piscar a cada clique.
- As tabelas administrativas podem ser roladas horizontalmente em telas estreitas, e os campos de data e horário do formulário se empilham no mobile.
- Imagens externas do catálogo e do hero têm fallback visual quando a fonte não responde.

## Testes automatizados

Priorizamos os fluxos que não podem quebrar em produção: criação de pedido válido, rejeição de entrada inválida, rejeição de pedido para animal indisponível, bloqueio de pedido pendente duplicado, bloqueio do painel sem autenticação, login e logout, acesso autorizado com token válido, confirmação de pedido, inativação automática do animal, cancelamento manual e em cascata, bloqueio de alteração de um pedido já finalizado, resumo, exportação CSV, CRUD de animais e proteção contra exclusão com pedidos vinculados. A build de produção do frontend é validada separadamente. Os testes usam um arquivo SQLite próprio (`db.test.sqlite3`), separado do banco de desenvolvimento, para que a reversão das migrations ao final da suíte não apague os dados locais.

## Escopo não implementado

Optamos por não implementar envio de e-mail real, upload de arquivos, bloqueio de conta após tentativas de login malsucedidas e deploy em ambiente de produção. Essas funcionalidades exigiriam infraestrutura adicional (SMTP, armazenamento de arquivos e ambiente de hospedagem) e não eram necessárias para validar o núcleo funcional exigido pela especificação.

Como melhorias além do núcleo, implementamos contadores de pedidos e animais disponíveis no painel, proteção contra pedidos pendentes duplicados para o mesmo animal e e-mail, e exportação CSV da listagem filtrada. Elas foram escolhidas por reduzirem trabalho operacional real sem ampliar significativamente a complexidade do sistema.

## Uso de IA

Utilizamos IA de forma intensiva ao longo de todo o desenvolvimento: geração do código de backend (migrations, models, controllers, validadores, testes) e de frontend (componentes, hooks, páginas), além de apoio ativo no diagnóstico de problemas de ambiente. As decisões de produto — tema, stack, regras de negócio e escopo — foram sempre discutidas e definidas por nós; o código foi então implementado com apoio da IA e revisado antes de cada entrega.

Um exemplo de decisão tomada contra a sugestão da IA: na definição da arquitetura de frontend, a IA sugeriu um monólito (Adonis servindo páginas via Edge, sem SPA separada), argumentando que reduziria a complexidade de configuração — CORS, dois processos, dois ambientes. Optamos por manter React e Material UI como SPA separada mesmo assim, por ser a stack em que temos maior domínio prático, o que se refletiu diretamente na qualidade e velocidade de implementação da interface.

Um caso concreto de falsa sensação de segurança fornecida pela IA: o comando `tsc --noEmit`, executado isoladamente na raiz do projeto frontend, reportava zero erros de tipo e foi usado como sinal de que o código estava correto durante parte do desenvolvimento. Somente ao executar o build de produção real (`npm run build`, que utiliza `tsc -b` com project references) identificamos um import relativo incorreto em `components/admin/AdminLayout.tsx` — o `tsc --noEmit` isolado não estava de fato verificando esses arquivos. A partir dessa descoberta, passamos a validar exclusivamente com o comando de build real.

Outro problema identificado apenas em teste manual, fora da cobertura automatizada: uma das fotos do seed de animais, referenciada por um ID fixo do Unsplash, deixou de carregar após a foto original sair do ar na fonte externa. Corrigimos trocando por uma fonte de imagem mais estável e adicionando um fallback visual no card para qualquer imagem que falhe ao carregar.