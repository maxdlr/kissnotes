#debug flags:
#a for all debugging (same as make -d and make --debug).
#b for basic debugging.
#v for slightly more verbose basic debugging.
#i for implicit rules.
#j for invocation information.
#m for information during makefile remakes.
MAKEFLAGS += --no-print-directory
#MAKEFLAGS += --debug=v
# MAKEFLAGS += -s
include .env
export $(shell sed 's/=.*//' .env)
.DEFAULT_GOAL := help
#.PHONY: all
ARG=$(filter-out $@, $(MAKECMDGOALS))

pt: ## Run Posting with the project request collection
	posting --collection ./request-collection

i: ## npm i for back and front
	npm run install:front && npm run install:back

dev: ## npm run dev for backa and front
	make -j2 dev-f dev-b

dev-f: ## npm run dev for back
	npm run dev:front

dev-b: ## npm run dev for back
	npm run dev:back

%:
	@:

help: ## This menu
	@echo "Usage: make [target]"
	@echo
	@echo "Available targets:"
	@echo
	@echo "---------- $(PRIMARY_COLOR)App commands$(END_COLOR)"
	@awk -F ':|##' '/^app-.*?:.*?##/ && !/##hidden/ {printf "$(SUCCESS_COLOR)%-30s$(END_COLOR) %s\n", $$1, $$NF}' $(MAKEFILE_LIST) | sort
	@echo
	@echo "---------- $(PRIMARY_COLOR)Backend commands$(END_COLOR)"
	@awk -F ':|##' '/^back-.*?:.*?##/ && !/##hidden/ {printf "$(SUCCESS_COLOR)%-30s$(END_COLOR) %s\n", $$1, $$NF}' $(MAKEFILE_LIST) | sort
	@echo
	@echo "---------- $(PRIMARY_COLOR)Frontend commands$(END_COLOR)"
	@awk -F ':|##' '/^front-.*?:.*?##/ && !/##hidden/ {printf "$(SUCCESS_COLOR)%-30s$(END_COLOR) %s\n", $$1, $$NF}' $(MAKEFILE_LIST) | sort
