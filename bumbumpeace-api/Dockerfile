# --- Build stage ---
FROM golang:1.24-alpine AS build
WORKDIR /src

# Module has no external dependencies, so go.mod alone is enough.
COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /bin/api .

# --- Runtime stage ---
FROM alpine:3.20
RUN apk add --no-cache ca-certificates
COPY --from=build /bin/api /bin/api

# Railway injects PORT at runtime; the app reads it (defaults to 8080 locally).
ENV PORT=8080
EXPOSE 8080

CMD ["/bin/api"]
