package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type StatsClient struct {
	baseURL    string
	httpClient *http.Client
}

type statsRequest struct {
	Q [][]float64 `json:"q"`
	R [][]float64 `json:"r"`
}

func NewStatsClient(baseURL string) *StatsClient {
	return &StatsClient{
		baseURL:    baseURL,
		httpClient: &http.Client{Timeout: 5 * time.Second},
	}
}

func (c *StatsClient) GetStats(q, r [][]float64) (map[string]interface{}, error) {
	payload, _ := json.Marshal(statsRequest{Q: q, R: r})

	req, err := http.NewRequest(http.MethodPost, c.baseURL+"/api/stats", bytes.NewReader(payload))

	if err != nil {
		return nil, fmt.Errorf("No se pudo construir la solicitud: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)

	if err != nil {
		return nil, fmt.Errorf("Error al llamar a la API de estadísticas: %w", err)
	}

	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("La API de estadísticas respondió %d: %s", resp.StatusCode, string(body))
	}

	var result map[string]interface{}

	json.Unmarshal(body, &result)

	return result, nil
}
