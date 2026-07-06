#debug flags:
#a for all debugging (same as make -d and make --debug).
#b for basic debugging.
#v for slightly more verbose basic debugging.
#i for implicit rules.
#j for invocation information.
#m for information during makefile remakes.
DOCKER = docker
MAKEFLAGS += --no-print-directory -s
#MAKEFLAGS += --debug=v
# MAKEFLAGS += -s
include .env
export $(shell sed 's/=.*//' .env)
.DEFAULT_GOAL := help
#.PHONY: all
ARG=$(filter-out $@, $(MAKECMDGOALS))

define EXEC
    $(DOCKER) exec -w / $(DB_CONTAINER_NAME) $(1)
endef

MARIADB = $(call EXEC, mariadb -u root -p"root" --show-warnings -vvv -t)


prod: ## Launch production environment via Docker
	docker compose -f docker-compose.prod.yml up --build --remove-orphans --force-recreate -d

prod-down: ## Stop production environment
	docker compose -f docker-compose.prod.yml down

prod-logs: ## Show production logs
	docker compose -f docker-compose.prod.yml logs -f

pt: ## Run Posting with the project request collection
	posting --collection ./request-collection

i: ## npm i for back and front
	npm run install:front && npm run install:back

dev: ## npm run dev for back and front
	make start-db
	make db-wait
	make db-drop
	make db-create
	make -j2 dev-f dev-b

build: ## npm run build for back and front
	npm run build:front && npm run build:back

start: ## npm run start for back and front
	make start-db
	make db-wait
	make db-create
	make -j2 start-f start-b

start-f: ## npm run start for front
	npm run start:front

start-b: ## npm run start for back
	npm run start:back

dev-f: ## npm run dev for back
	npm run dev:front

dev-b: is-db-created ## npm run dev for back
	npm run dev:back

start-db: ## start the database docker service
	docker compose up --remove-orphans --force-recreate --build -d

is-db-created: is-db-up ## check if the database is created
	$(MARIADB) --database=$(APP_NAME) -e "SHOW TABLES;" \
		&& echo "✔ kissnotes database exists" \
		|| { echo "✘ kissnotes database does not exist"; exit 1; }

is-db-up: ## Check if db service is up
	@docker ps --filter "name=$(DB_CONTAINER_NAME)" --filter "status=running" --format "{{.Names}}" | grep -q "$(DB_CONTAINER_NAME)" \
		&& echo "✔ $(DB_CONTAINER_NAME) is up" \
		|| { echo "✘ $(DB_CONTAINER_NAME) is not running"; exit 1; }

db-create: db-wait ## Creates database db
	$(MARIADB) -e "CREATE DATABASE IF NOT EXISTS $(APP_NAME);"

db-drop: db-wait ## Drop database db
	$(MARIADB) -e "DROP DATABASE IF EXISTS $(APP_NAME);"

db-wait: ## Wait for MariaDB to be ready
	@echo "Waiting for MariaDB to be ready..."
	@for i in $$(seq 1 20); do \
		docker exec $(DB_CONTAINER_NAME) mariadb -u root -p"root" -e "SELECT 1;" > /dev/null 2>&1 \
			&& echo "✔ MariaDB is ready" && exit 0; \
		echo "  ...waiting ($$i/20)"; \
		sleep 2; \
	done; \
	echo "✘ MariaDB did not become ready in time"; exit 1

prod-exec-back: ## Exec into the production back container
	docker exec -it $(APP_NAME)-back-prod sh

prod-exec-front: ## Exec into the production front container
	docker exec -it $(APP_NAME)-front-prod sh

prod-exec-db: ## Exec into the production db container
	docker exec -it $(APP_NAME)-db-prod mariadb -u root -p"$(DB_PASSWORD)" $(APP_NAME)

prod-exec-nginx: ## Exec into the production nginx container
	docker exec -it $(APP_NAME)-nginx sh

prod-run-back: ## Run a command in the production back container (usage: make prod-run-back CMD="...")
	docker exec $(APP_NAME)-back-prod sh -c "$(CMD)"

prod-db-nuke: ## Drop and recreate the production database
	docker exec $(APP_NAME)-db-prod mariadb -u root -p"$(DB_PASSWORD)" -e "DROP DATABASE IF EXISTS $(APP_NAME); CREATE DATABASE $(APP_NAME);"
	@echo "✔ Database nuked and recreated. Restarting back to re-sync schema."
	docker restart $(APP_NAME)-back-prod

%:
	@:

help: ## This menu
	@echo "Usage: make [target]"
	@echo
	@echo "Available targets:"
	@echo
	@awk -F ':|##' '/^[a-zA-Z_-]+:.*?##/ && !/##hidden/ {printf "  %-20s %s\n", $$1, $$NF}' $(MAKEFILE_LIST) | sort
