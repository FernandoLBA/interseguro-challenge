# syntax=docker/dockerfile:1

FROM golang:1.27-alpine AS builder
WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/api-go-qr .

FROM alpine:3.20 AS runtime

RUN apk add --no-cache ca-certificates wget \
  && addgroup -S app \
  && adduser -S app -G app

WORKDIR /app
COPY --from=builder /out/api-go-qr .

ENV PORT=8080
EXPOSE 8080

USER app

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT}/health" || exit 1

ENTRYPOINT [ "/app/api-go-qr" ]