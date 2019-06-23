include .env
export $(shell sed 's/=.*//' .env)

postgresContainerName = blog-postgres
redisContainerName = blog-redis
nodejsContainerName = blog-nodejs
rabbitContainerName = blog-rabbitmq

prod-server:
	docker-compose up -d
prod-yarn-install:
	docker-compose run ${nodejsContainerName} yarn install
prod-schema-sync:
	docker-compose run ${nodejsContainerName} yarn typeorm schema:sync
dev-server:
	docker-compose up -d ${postgresContainerName} ${redisContainerName} ${rabbitContainerName}
	yarn nodemon
postgres-cli:
	docker-compose exec ${postgresContainerName} psql -d ${DB_NAME} -U ${DB_USER}
postgres-init-extensions:
	docker-compose exec ${postgresContainerName} psql -U postgres -d ${DB_NAME} -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
redis-flush-all:
	docker-compose exec ${redisContainerName} sh -c "redis-cli flushall"
