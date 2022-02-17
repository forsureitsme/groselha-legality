# Changelog

Todas alterações relevantes para os usuários serão salvas neste arquivo.
[Formato das alterações](https://keepachangelog.com/en/1.0.0/)

## Para fazer

- Requisições feitas à banlist da Talisman serão salvas no cache, já que é necessário alterar no código sempre que há alguma alteração.
- Verificação de legalidade de cartas de dois lados (ie. `Glasspool Mimic // Glasspool Shore`)
- Alterar estilo da página completamente.
- Identificar corretamente legalidade onde o preço da carta foil é mais barato do que o preço da carta normal.
- Permitir alteração da banlist sem que seja necessário alterar o código fonte.

## [0.3.0]

### Adicionado

- A partir dessa versão, alterações serão documentadas no [changelog](https://github.com/forsureitsme/groselha-legality/blob/main/CHANGELOG.md)
- Escudos adicionados no site e no leia-me.

### Alterado

- Projeto refatorado para utilizar [funções serverless](https://vercel.com/docs/concepts/functions/serverless-functions#).
- Nova banlist da Talisman Store.
