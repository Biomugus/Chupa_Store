# Architecture Overview

## Purpose

Описание общих принципов архитектуры проекта.

## Layers

- UI (components, presentation)
- Containers (state & orchestration)
- Domain (business logic)
- Services (API, side effects)
- Shared (utils, api client, types)

## Data flow

User → UI → Container → Domain → Service → API

## Boundaries

- UI не знает про API
- Domain не знает про React
- Services не содержат бизнес-логики
