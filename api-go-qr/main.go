package main

import (
	"log"
	"os"

	"github.com/fernandolba/interseguro-challenge/api-go-qr/internal/client"
	"github.com/fernandolba/interseguro-challenge/api-go-qr/internal/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No se encontró archivo .env, se usarán variables de entorno del sistema")
	}

	nodeStatsAPIURL := getEnv("NODE_STATS_API_URL", "http://localhost:3000")
	port := getEnv("PORT", "3000")
	allowedOrigins := getEnv("ALLOWED_ORIGINS", "*")

	statsClient := client.NewStatsClient(nodeStatsAPIURL)

	app := fiber.New(fiber.Config{AppName: "api-go-qr"})
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: allowedOrigins,
		AllowMethods: "GET,POST,OPTIONS",
		AllowHeaders: "Content-Type",
	}))

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	app.Post("/api/qr", handlers.NewQRHandler(statsClient))

	log.Printf("api-go-qr escuchando en: %s (Node stats API en %s)", port, nodeStatsAPIURL)

	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("No se pudo iniciar el servidor: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}

	return fallback
}
