package handlers

import (
	"github.com/fernandolba/interseguro-challenge/api-go-qr/internal/client"
	"github.com/fernandolba/interseguro-challenge/api-go-qr/internal/linalg"
	"github.com/gofiber/fiber/v2"
)

type qrRequestBody struct {
	Matrix [][]float64 `json:"matrix"`
}

type qrResult struct {
	Q [][]float64 `json:"q"`
	R [][]float64 `json:"r"`
}

func NewQRHandler(statsClient *client.StatsClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body qrRequestBody

		if err := c.BodyParser(&body); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "El body debe ser un JSON válido, con forma {\"Matrix\": [[...], [...]]}",
			})
		}

		q, r, err := linalg.QRDecompose(linalg.Matrix(body.Matrix))

		if err != nil {
			return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		stats, err := statsClient.GetStats(q, r)

		if err != nil {
			return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
				"error":  "La factorización QR se calculó correctamente, sin embargo falló la comunicación con la API de estadísticas",
				"detail": err.Error(),
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"qr":    qrResult{Q: q, R: r},
			"stats": stats,
		})
	}
}
