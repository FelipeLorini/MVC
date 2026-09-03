# EventHub — Sistema de Gestão de Eventos e Inscrições

Aplicação MVC em Node.js/Express com views EJS, autenticação por sessão
(cookie `httpOnly`) e banco de dados MySQL — organizada em camadas
(**routes → controllers → services → models**) para manter cada parte
com uma única responsabilidade.

## Funcionalidades

- Cadastro e login de usuários (organizador ou participante)
- CRUD completo de eventos (somente o organizador dono do evento edita/exclui)
- Inscrição e cancelamento de inscrição em eventos (participantes)
- Painel ("Meu painel") com "meus eventos" e "minhas inscrições"
- Página inicial com destaque para os próximos eventos

## Arquitetura em camadas

```
Request → routes → (validators, auth middleware) → controllers → services → models → MySQL
                                                          ↓
                                                       views (EJS)
```

- **routes/** — apenas define os endpoints e encadeia os middlewares.
- **middlewares/validators.js** — valida o `req.body` antes de chegar no controller.
- **controllers/** — bem enxutos: leem a requisição, chamam um service e
  renderizam a resposta. Nenhuma regra de negócio ou SQL aqui.
- **services/** — toda a regra de negócio (ex: "só o dono edita o evento",
  "não inscrever duas vezes", "respeitar a capacidade máxima"). Lançam
  `AppError` quando algo viola uma regra.
- **models/** — só acesso a dados (prepared statements via `mysql2`).
- **utils/AppError.js** + **middlewares/errorHandler.js** — um erro de
  negócio (`throw new AppError(mensagem, status, redirectTo)`) é
  capturado uma única vez, no fim da cadeia, e vira uma mensagem flash +
  redirecionamento — em vez de repetir `try/catch` em cada controller.
- **utils/asyncHandler.js** — encaminha automaticamente qualquer erro de
  função assíncrona para o `errorHandler`, sem boilerplate.
- **config/env.js** — valida na inicialização se todas as variáveis de
  ambiente obrigatórias existem (falha rápido, com mensagem clara).
- **config/constants.js** — papéis de usuário (`organizador`/`participante`)
  centralizados, sem strings mágicas espalhadas pelo código.

## Stack

- Node.js + Express
- EJS (views) — design em fonte Space Grotesk (títulos), IBM Plex Sans
  (texto) e IBM Plex Mono (datas/dados), com um cartão de evento no
  estilo "canhoto de ingresso"
- MySQL (`mysql2`, sempre com prepared statements — previne SQL Injection)
- `express-session` (sessão com cookie `httpOnly`)
- `bcrypt` (hash de senhas)
- `dotenv`, `method-override`, `connect-flash`

## Estrutura de pastas

```
eventhub-mvc/
├── app.js
├── config/
│   ├── constants.js
│   ├── env.js
│   └── db.js
├── controllers/
│   ├── pageController.js
│   ├── authController.js
│   ├── eventController.js
│   ├── registrationController.js
│   └── dashboardController.js
├── services/
│   ├── authService.js
│   ├── eventService.js
│   ├── registrationService.js
│   └── dashboardService.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── validators.js
│   └── errorHandler.js
├── models/
│   ├── userModel.js
│   ├── eventModel.js
│   └── registrationModel.js
├── utils/
│   ├── AppError.js
│   ├── asyncHandler.js
│   └── logger.js
├── routes/
│   ├── pageRoutes.js
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── dashboardRoutes.js
├── views/
│   ├── partials/ (header.ejs, footer.ejs)
│   ├── auth/ (login.ejs, register.ejs)
│   ├── events/ (index.ejs, show.ejs, new.ejs, edit.ejs, _card.ejs)
│   ├── home.ejs, dashboard.ejs, 404.ejs, 500.ejs
├── public/
│   ├── css/style.css
│   └── js/app.js
├── sql/schema.sql
├── package.json
└── .env.example
```

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie o arquivo de variáveis de ambiente e preencha com os dados do seu MySQL:
   ```bash
   cp .env.example .env
   ```
3. Crie o banco e as tabelas:
   ```bash
   mysql -u root -p < sql/schema.sql
   ```
4. Inicie a aplicação:
   ```bash
   npm start
   ```
   ou em modo desenvolvimento (recarrega sozinho):
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000`

## Variáveis de ambiente

Veja `.env.example`. Se o seu MySQL exigir SSL (caso da Aiven), defina `DB_SSL=true`.
Se faltar alguma variável obrigatória, a aplicação recusa subir e informa
exatamente qual variável está faltando (veja `config/env.js`).

## Segurança

- Cookie de sessão `httpOnly`, e `secure` automaticamente quando `NODE_ENV=production`.
- Todas as queries usam *prepared statements* (`?`) via `mysql2` — previne SQL Injection.
- Senhas armazenadas com hash `bcrypt`, nunca em texto puro.
- Validação de entrada antes de qualquer controller (`middlewares/validators.js`).
