package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", handleHealth)
	mux.HandleFunc("GET /cities", handleCities)

	addr := ":" + getenv("PORT", "8080")
	handler := withCORS(withLogging(mux))

	srv := &http.Server{
		Addr:              addr,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("bumbumpeace-api listening on %s", addr)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server error: %v", err)
	}
}

func handleHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

// handleCities returns the server-owned city list. Optional ?region= and
// ?lifestyle= query params filter the results.
func handleCities(w http.ResponseWriter, r *http.Request) {
	region := r.URL.Query().Get("region")
	lifestyle := r.URL.Query().Get("lifestyle")

	result := make([]City, 0, len(cities))
	for _, c := range cities {
		if region != "" && !strings.EqualFold(region, "all") && c.Region != region {
			continue
		}
		if lifestyle != "" && !strings.EqualFold(lifestyle, "all") && c.Lifestyle != lifestyle {
			continue
		}
		result = append(result, c)
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"count":  len(result),
		"cities": result,
	})
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Printf("encode error: %v", err)
	}
}

// withCORS allows the local Next.js dev server (and any origins listed in
// ALLOWED_ORIGINS, comma-separated) to call the API from the browser.
func withCORS(next http.Handler) http.Handler {
	allowed := map[string]bool{"http://localhost:3000": true}
	for _, o := range strings.Split(getenv("ALLOWED_ORIGINS", ""), ",") {
		if o = strings.TrimSpace(o); o != "" {
			allowed[o] = true
		}
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if allowed[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func withLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start))
	})
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
