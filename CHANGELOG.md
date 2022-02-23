# Changelog

Todas alterações relevantes para os usuários serão salvas neste arquivo, seguindo [este formato](https://keepachangelog.com/en/1.0.0/).

<!--

## Para fazer

- Idenfiticar cards banidos através das palavras-chave definidas nas regras do formato. (ex.: `extra turn`, `win the game`, `lose the game`)
- Adicionar lembrete sobre os 16 de dano necessário para derrotar um jogador através de Infect.
- Permitir alteração da banlist sem que seja necessário alterar o código fonte.
- Requisições feitas à banlist da Talisman serão salvas no cache, já que é necessário alterar no código sempre que há alguma alteração.
- Alterar estilo da página completamente.
- Identificar corretamente legalidade onde o preço da carta foil é mais barato do que o preço da carta normal.

-->

## [0.2.0]

### Adicionado

- Erros na API e no site serão registrados no [Sentry](https://sentry.io).

## [0.1.1]

### Corrigido

- Verificação de legalidade de cartas de dois lados (ie. `Glasspool Mimic // Glasspool Shore`)

## [0.1.0]

### Adicionado

- A partir dessa versão, alterações serão documentadas no [changelog](https://github.com/forsureitsme/groselha-legality/blob/main/CHANGELOG.md)
- Escudos adicionados no site e no leia-me.

### Alterado

- Projeto refatorado para utilizar [funções serverless](https://vercel.com/docs/concepts/functions/serverless-functions#).
- Nova banlist da Talisman Store.
