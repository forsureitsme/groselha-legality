# Legalidade Groselha

![Versão](https://img.shields.io/github/package-json/v/forsureitsme/groselha-legality?color=%23FEA0ED&label=Vers%C3%A3o&style=for-the-badge)
![Última Alteração](https://img.shields.io/github/last-commit/forsureitsme/groselha-legality/main?color=FEA0ED&label=%C3%9Altima%20Altera%C3%A7%C3%A3o&style=for-the-badge)

Página para identificar legalidade de cards de Magic: The Gathering no formato Groselha da Talisman Store.

https://groselha-legality.vercel.app

## Desenvolvimento

- Instale o [Docker](https://docs.docker.com/get-docker/)
- Crie o projeto na [Vercel](https://vercel.com/) a partir do seu repositório
- Crie um arquivo `.env` na raiz do projeto ([.env.example](./.env.example))
- Defina as seguintes configurações no `.env`:
  - `GL_VERCEL_TOKEN`: [Chave da Vercel](https://vercel.com/account/tokens)
  - `GL_DB_*`: Configurações do banco de dados
- Rode o comando `docker-compose up`
- Acesse http://localhost:3000

## Alterações

Veja o [CHANGELOG](https://github.com/forsureitsme/groselha-legality/blob/main/CHANGELOG.md)
