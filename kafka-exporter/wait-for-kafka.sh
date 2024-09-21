#!/bin/bash

HOST="$1"
PORT="$2"
shift 2
CMD="$@"

echo "Esperando a que Kafka esté disponible en $HOST:$PORT..."

while ! nc -z "$HOST" "$PORT"; do
  sleep 2
done

echo "Kafka está disponible en $HOST:$PORT. Iniciando Kafka Exporter..."
exec $CMD