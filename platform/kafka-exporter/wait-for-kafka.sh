#!/bin/bash

HOST="$1"
PORT="$2"
shift 2
CMD="$@"

echo "Waiting for Kafka to be available at $HOST:$PORT..."

while ! nc -z "$HOST" "$PORT"; do
  sleep 2
done

echo "Kafka is available at $HOST:$PORT. Starting Kafka Exporter..."
exec $CMD