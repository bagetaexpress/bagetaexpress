SHELL := /usr/bin/env bash

PNPM_VERSION := 9.11.0
PNPM := pnpm

.PHONY: help install dev build start lint ts-check format format-check \
	db-push migration-generate migration-push migration-pushc \
	migration-pushp migration-pushcp migration-studio

help:
	@echo "Targets:"
	@echo "  install             Enable corepack and install deps with pnpm"
	@echo "  dev                 Run dev server"
	@echo "  build               Build for production"
	@echo "  start               Start production server"
	@echo "  lint                Run ESLint"
	@echo "  ts-check            Run TypeScript type checking"
	@echo "  format              Format code with Prettier"
	@echo "  format-check        Check formatting with Prettier"
	@echo "  db-push             Push database schema changes"
	@echo "  migration-generate  Generate database migrations"
	@echo "  migration-push      Apply database migrations"
	@echo "  migration-pushc     Apply migrations with clear"
	@echo "  migration-pushp     Apply migrations with populate"
	@echo "  migration-pushcp    Apply migrations with clear+populate"
	@echo "  migration-studio    Open Drizzle Studio"

install:
	@corepack enable
	@corepack prepare pnpm@$(PNPM_VERSION) --activate
	@$(PNPM) install

dev:
	@$(PNPM) run dev

build:
	@$(PNPM) run build

start:
	@$(PNPM) run start

lint:
	@$(PNPM) run lint

ts-check:
	@$(PNPM) run ts:check

format:
	@$(PNPM) run format

format-check:
	@$(PNPM) run format:check

db-push:
	@$(PNPM) run db:push

migration-generate:
	@$(PNPM) run migration:generate

migration-push:
	@$(PNPM) run migration:push

migration-pushc:
	@$(PNPM) run migration:pushc

migration-pushp:
	@$(PNPM) run migration:pushp

migration-pushcp:
	@$(PNPM) run migration:pushcp

migration-studio:
	@$(PNPM) run migration:studio
