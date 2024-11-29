# Task Manager REST-API

Task manager application built using **NODE JS** and **PostgreSQL**

## Features

-   User management
-   Task managemment

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /api/v1/users/login` - login\
`POST /api/v1/users/logout` - logout

**User routes**:\
`POST /api/v1/users` - create a user\
`GET /api/v1/users/me` - get profile of logged in user\
`PATCH /api/v1/users/me` - update logged in user\
`DELETE /api/v1/users/me` - delete logged in user

**Task routes**:\
`POST /api/v1/users/tasks` - create a task\
`GET /api/v1/users/tasks/:taskId` - get task by id\
`PATCH /api/v1/users/tasks/:taskId`- update task\
`DELETE /api/v1/users/tasks/:taskId` - delete task

## Dependencies

-   [Express.js](https://expressjs.com/) web framework
-   [Typescript Lang](https://www.typescriptlang.org/) for writing the app's logic.
-   [compression](https://www.npmjs.com/package/compression) Node.js compression middleware.
-   [cors](https://www.npmjs.com/package/cors) CORS middleware.
-   [helmet](https://www.npmjs.com/package/helmet) HTTP security.
-   [bcryptjs](https://www.npmjs.com/package/bcryptjs) encrypt, decrypt.
-   [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) JWT authentication.
-   [winston](https://www.npmjs.com/package/winston) logging.
-   [morgan](https://www.npmjs.com/package/morgan) http logging.
-   [prisma](https://www.prisma.io) Object Relational Mapping.

## Getting Started

#### Clone the repo:

```bash
git clone git@github.com:sevennguyen07/task-management.git
```

#### Install dependencies:

```bash
# use npm
npm install

#use yarn
yarn install
```

#### Set environment variables:

```bash
cp .env.template .env
```

#### Running Locally

```bash
# run PostgreSQL container
yarn docker:dev-db:start

# start app
yarn dev

# view swagger doc and test api
http://localhost:3000/api/v1
```

#### Testing

```bash
# run all tests
yarn test
```

#### Database

```bash
# run docker container with PostgreSQL db
yarn docker:dev-db:start

# stop docker container with PostgreSQL db
yarn docker:dev-db:stop

# start prisma studio
yarn db:studio
```
