<p align="center"><img src="https://uploads.photo/images/Ed7f.png" width="200"/></p>

<p align="center" style="font-size:1.8em;">Мой блог. Backend</p>

##  Список основых технологий

- Язык программирования: [TypeScript](https://www.typescriptlang.org)
- Синтаксис [ECMAScript2017](https://www.ecma-international.org/ecma-262/8.0/#sec-async-function-definitions)
- Паттерны: [SOLID](https://itnext.io/solid-principles-explanation-and-examples-715b975dcad4), [DI](https://en.wikipedia.org/wiki/Dependency_injection)
- [Node.js](https://nodejs.org/en/docs/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [RabbitMQ](https://www.rabbitmq.com/getstarted.html)
- [Redis](https://redis.io/documentation)
- [Express](https://expressjs.com)
- [TypeORM](https://typeorm.io/#/)
- [Inversify](https://github.com/inversify/InversifyJS)
- [Socket.io](https://socket.io)
- [TS-node](https://github.com/TypeStrong/ts-node)
- [Winston](https://github.com/winstonjs/winston)

## Список дополнительных технологий

- [@google-cloud/translate](https://cloud.google.com/translate/docs/)
- [Amqp connection manager](https://github.com/benbria/node-amqp-connection-manager)
- [Amqp lib](https://github.com/squaremo/amqp.node)
- [Argon 2](https://en.wikipedia.org/wiki/Argon2)
- [Axios](https://github.com/axios/axios)
- [Inversify binding decorators](https://github.com/inversify/inversify-binding-decorators)
- [inversify express utils](https://github.com/inversify/inversify-express-utils)
- [IO Redis](https://github.com/luin/ioredis)
- [Lodash](https://lodash.com)
- [Moment](https://momentjs.com)
- [Nodemon](https://github.com/remy/nodemon#nodemon)
- [Passport.js](http://www.passportjs.org/docs/downloads/html/)
- [Passport jwt](https://github.com/mikenicholson/passport-jwt)

## Разворачивание проекта для разработки

1. Скопировать файл окружения
    ```bash
    cp ./.env.dist ./.env
    ```
    
2. Заменить переменные окружения в созданном файле

3. Установить npm зависимости
    ```bash
    yarn install
    ```
    
4. Запустить dev server
    ```bash
    make dev-server
    ```
    
5. Установить расширения postgres
    ```bash
    make postgres-init-extensions
    ```

6. Синхронизировать схему БД
    ```bash
    yarn typeorm:schema: sync
    ```

## Разворачивание проекта для работы

1. Скопировать файл окружения
    ```bash
    cp ./.env.dist ./.env
    ```
    
2. Заменить переменные окружения в созданном файле

3. Установить npm зависимости
    ```bash
    prod-yarn-install
    ```
    
4. Запустить prod server
    ```bash
    make prod-server
    ```
    
5. Установить расширения postgres
    ```bash
    make postgres-init-extensions
    ```

6. Синхронизировать схему БД
    ```bash
    make prod-schema-sync
    ```
