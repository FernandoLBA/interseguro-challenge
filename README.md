# Interseguros — Coding Challenge

Dos microservicios que colaboran entre sí:

- **[api-go-qr](api-go-qr/)** (Go + Fiber): recibe una matriz, calcula su factorización QR y le pide estadísticas a `api-node-stats`.
- **[api-node-stats](api-node-stats/)** (Node + TypeScript + Express): recibe matrices con nombre y devuelve estadísticas (máx, mín, suma, promedio, diagonal).

```
Cliente → POST /api/qr (Go, :8000)
              │
              ├─ calcula Q, R (Gram-Schmidt)
              └─ POST /api/stats (Node, :3000) ──► estadísticas de Q y R
              │
              ◄─ respuesta combinada { qr, stats }
```

Cada servicio tiene su propio README con el detalle de endpoints, variables de entorno y comandos: ver [api-go-qr/README.md](api-go-qr/README.md) y [api-node-stats/README.md](api-node-stats/README.md).

## Requisitos

- Go 1.27+
- Node 22+
- Docker y Docker Compose (opcional, para correr todo containerizado)

## Quick start (local, sin Docker)

```bash
# variables de entorno de cada servicio
cp api-go-qr/.env.example api-go-qr/.env
cp api-node-stats/.env.example api-node-stats/.env

# dependencias
npm install                      # concurrently, en la raíz
npm run install:node             # dependencias de api-node-stats

# levantar ambos servicios juntos
npm run dev
```

Esto deja `api-go-qr` en `http://localhost:8000` y `api-node-stats` en `http://localhost:3000`.

## Quick start (Docker)

```bash
docker compose up --build
```

`api-go-qr` queda expuesto en `http://localhost:8080` (se comunica con `api-node-stats` por la red interna de Docker; ese servicio no expone puerto al host).

## Scripts disponibles (raíz)

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta Go y Node juntos (con `concurrently`) |
| `npm run dev:go` / `npm run dev:node` | Levanta cada servicio por separado |
| `npm run test` | Corre los tests de ambos (`go test` + `node:test`) |
| `npm run build:go` | Compila el binario de `api-go-qr` |

## Tests

```bash
npm run test
```

## Notas

- Sin `.env` ni variable de entorno seteada, `api-go-qr` cae al puerto por defecto embebido en el código (ver `main.go`); usar el `.env` de cada servicio evita cualquier colisión de puertos en desarrollo local.
- `api-node-stats` tiene lockfiles de dos package managers (`npm` y `pnpm`); los scripts y el Dockerfile asumen `npm`.

## Estructura del repo

```
.
├── api-go-qr/          # servicio Go — factorización QR
├── api-node-stats/     # servicio Node — estadísticas de matrices
├── docker-compose.yml  # orquesta ambos servicios containerizados
└── package.json        # scripts para correr/testear todo en conjunto
```
