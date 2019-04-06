include .env
export $(shell sed 's/=.*//' .env)

.PHONY: help

nodejsContainerName = blog-nodejs
postgresContainerName = blog-postgres
redisContainerName = blog-redis

## Выводит описание команд.
help:
	@echo "$$(tput bold)Available rules:$$(tput sgr0)";echo;sed -ne"/^## /{h;s/.*//;:d" -e"H;n;s/^## //;td" -e"s/:.*//;G;s/\\n## /---/;s/\\n/ /g;p;}" ${MAKEFILE_LIST}|LC_ALL='C' sort -f|awk -F --- -v n=$$(tput cols) -v i=19 -v a="$$(tput setaf 6)" -v z="$$(tput sgr0)" '{printf"%s%*s%s ",a,-i,$$1,z;m=split($$2,w," ");l=n-i;for(j=1;j<=m;j++){l-=length(w[j])+1;if(l<= 0){l=n-i-length(w[j])-1;printf"\n%*s ",-i," ";}printf"%s ",w[j];}printf"\n";}'|more $(shell test $(shell uname) == Darwin && echo '-Xr')
## Выполняет набор команд для инициализации. Используй при первом поднятии приложения.
init:
## Альяс для "docker-compose up"
up:
	docker-compose run ${nodejsContainerName} sh -c "cd /app && tsc && node /app/build/app.js"
## Ставит зависимости nodejs.
yarn-install:
	docker-compose run ${nodejsContainerName} sh -c "cd /app && yarn install"
## Зайти в контейнер nodejs.
exec-nodejs-container:
	docker-compose exec ${nodejsContainerName} sh
dev-server:
	docker-compose up -d ${postgresContainerName} ${redisContainerName}
	yarn nodemon
## Открывает Postgres консоль для управления DB. Должны быть заданы параметры DATABASE_NAME и DATABASE_USER в .env
postgres-cli:
	docker-compose exec ${postgresContainerName} psql -d ${DB_NAME} -U ${DB_USER}
postgres-init-extensions:
	docker-compose exec ${postgresContainerName} psql -U postgres -d ${DB_NAME} -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
## Чистит Redis.
redis-flush-all:
	docker-compose exec ${redisContainerName} sh -c "redis-cli flushall"
