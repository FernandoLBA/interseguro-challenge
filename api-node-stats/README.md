# api-node-stats

API en Node/TypeScript (Express 5) que recibe una o más matrices con nombre y devuelve estadísticas: máximo, mínimo, suma, promedio y si cada una es diagonal. La consume internamente [`api-go-qr`](../api-go-qr) para enriquecer el resultado de una factorización QR.

## Endpoints

### `GET /health`

```json
{ "status": "ok" }
```

### `POST /api/stats`

**Request**

```json
{
  "q": [[1, 0], [0, 1]],
  "r": [[2, 0], [0, 2]]
}
```

Ambas matrices (`q` y `r`) son obligatorias.

**Response `200 OK`**

```json
{
  "max": 2,
  "min": 0,
  "average": 0.75,
  "sum": 6,
  "diagonal": { "q": true, "r": true },
  "isAnyDiagonal": true
}
```

**Errores**

| Status | Causa |
|---|---|
| `400` | Falta `q` y/o `r` en el body |
| `422` | Alguna matriz es inválida: vacía, no rectangular, o con valores no numéricos |

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar si hace falta:

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `3000` | Puerto donde escucha el servidor |

Se cargan automáticamente con `process.loadEnvFile()` (Node 20.6+); si no hay `.env`, se usan las variables de entorno del sistema o el default.

## Correr localmente

Requiere Node 22+.

```bash
cp .env.example .env
npm install
npm run dev
```

## Tests

Usa el test runner nativo de Node (`node:test`), descubre automáticamente los archivos `*.test.ts`:

```bash
npm test
```

## Build / producción

```bash
npm run build   # compila a dist/ con tsc
npm start       # corre dist/server.js
```

## Docker

```bash
docker build -t api-node-stats .
docker run --rm -p 3000:3000 -e PORT=3000 api-node-stats
```

Para levantar ambos servicios juntos, ver el `docker-compose.yml` en la raíz del repo.

## Arquitectura

Patrón routes → controller → service → repository:

```
src/modules/stats/
├── routes/stats.routes.ts        # define POST /stats (montado bajo /api en server.ts)
├── controllers/stats.controller.ts  # capa HTTP: valida body, mapea status codes
├── services/stats.service.ts     # arma el NamedMatrices y delega al repository
├── repositories/stats.repository.ts # cómputo puro: validación de matrices + estadísticas
└── types/index.ts                # tipos compartidos (Matrix, StatsResult, etc.)

src/middlewares/error.middleware.ts # error handler, scopeado al router de stats
src/config/env.ts                   # carga de .env y variables tipadas
```

> Nota: el repo tiene tanto `package-lock.json` (npm) como `pnpm-lock.yaml`/`pnpm-workspace.yaml` (pnpm). Los scripts y el `Dockerfile` asumen **npm**; conviene quedarse con un solo package manager.
