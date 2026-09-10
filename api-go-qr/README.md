# api-go-qr

API en Go (Fiber) que recibe una matriz, calcula su factorización QR (Gram-Schmidt modificado) y enriquece la respuesta con estadísticas obtenidas de [`api-node-stats`](../api-node-stats).

## Endpoints

### `GET /health`

```json
{ "status": "ok" }
```

### `POST /api/qr`

**Request**

```json
{
  "matrix": [
    [12, -51],
    [6, 167],
    [-4, 24]
  ]
}
```

**Response `200 OK`**

```json
{
  "qr": {
    "q": [[0.857, -0.394], [0.429, 0.903], [-0.286, 0.171]],
    "r": [[14, 21], [0, 175]]
  },
  "stats": {
    "max": 175,
    "min": -0.394,
    "average": 21.168,
    "sum": 211.68,
    "diagonal": { "q": false, "r": false },
    "isAnyDiagonal": false
  }
}
```

**Errores**

| Status | Causa |
|---|---|
| `400` | El body no es un JSON válido o no tiene la forma `{ "matrix": [[...], [...]] }` |
| `422` | La matriz no cumple los requisitos de la factorización QR (ver abajo) |
| `502` | El QR se calculó bien, pero falló la comunicación con `api-node-stats` |

Errores `422` posibles (`internal/linalg/qr.go`):

- `ErrEmptyMatrix` — la matriz está vacía.
- `ErrNotRectangular` — las filas no tienen todas la misma cantidad de columnas.
- `ErrInsufficientRows` — hay menos filas que columnas.
- `ErrLinearlyDependent` — las columnas son linealmente dependientes (no está definida la factorización).

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar si hace falta:

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `8000` | Puerto donde escucha el servidor |
| `NODE_STATS_API_URL` | `http://localhost:3000` | Base URL de `api-node-stats` |

Si no existe `.env` ni las variables están seteadas en el sistema, se usan los defaults del código (ver `main.go`).

## Correr localmente

```bash
cp .env.example .env
go run .
```

## Tests

```bash
go test ./...
```

## Build

```bash
go build -o bin/api-go-qr .
```

## Docker

```bash
docker build -t api-go-qr .
docker run --rm -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_STATS_API_URL=http://host.docker.internal:3000 \
  api-go-qr
```

Para levantar ambos servicios juntos, ver el `docker-compose.yml` en la raíz del repo.

## Estructura

```
api-go-qr/
├── main.go                        # arranque del servidor Fiber
├── internal/
│   ├── client/stats_client.go     # cliente HTTP hacia api-node-stats
│   ├── handlers/qr_handler.go     # handler POST /api/qr
│   └── linalg/qr.go               # factorización QR (Gram-Schmidt)
```
