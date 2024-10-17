#!/bin/bash

# Generate a CLUSTER_ID if it's not present
if [ -z "$KAFKA_CLUSTER_ID" ]; then
  CLUSTER_ID=$(uuidgen)
  echo "Generated CLUSTER_ID: $CLUSTER_ID"
  export KAFKA_CLUSTER_ID=$CLUSTER_ID
fi

CONFIG_FILE="/opt/bitnami/kafka/config/server.properties"

# Create the server.properties file if it doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
  echo "File $CONFIG_FILE not found. Creating one..."
  touch "$CONFIG_FILE"
fi

echo "Configuring $CONFIG_FILE"

# Delete config duplicates
sed -i '/^process.roles=/d' "$CONFIG_FILE"
sed -i '/^node.id=/d' "$CONFIG_FILE"
sed -i '/^broker.id=/d' "$CONFIG_FILE"
sed -i '/^controller.quorum.voters=/d' "$CONFIG_FILE"
sed -i '/^listeners=/d' "$CONFIG_FILE"
sed -i '/^advertised.listeners=/d' "$CONFIG_FILE"
sed -i '/^listener.security.protocol.map=/d' "$CONFIG_FILE"
sed -i '/^inter.broker.listener.name=/d' "$CONFIG_FILE"
sed -i '/^log.dirs=/d' "$CONFIG_FILE"
sed -i '/^controller.listener.names=/d' "$CONFIG_FILE"
sed -i '/^auto.create.topics.enable=/d' "$CONFIG_FILE"
sed -i '/^group.initial.rebalance.delay.ms=/d' "$CONFIG_FILE"
sed -i '/^offsets.topic.replication.factor=/d' "$CONFIG_FILE"
sed -i '/^transaction.state.log.replication.factor=/d' "$CONFIG_FILE"
sed -i '/^transaction.state.log.min.isr=/d' "$CONFIG_FILE"

# User env variables
KAFKA_PORT=${KAFKA_PORT:-9092}
KAFKA_CONTROLLER_PORT=${KAFKA_CONTROLLER_PORT:-9093}

# Add config
cat <<EOL >>"$CONFIG_FILE"
process.roles=broker,controller
node.id=0
broker.id=0
controller.quorum.voters=0@kafka:$KAFKA_CONTROLLER_PORT
listeners=CONTROLLER://0.0.0.0:$KAFKA_CONTROLLER_PORT,INTERNAL://0.0.0.0:$KAFKA_PORT
advertised.listeners=INTERNAL://kafka:$KAFKA_PORT
listener.security.protocol.map=CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT
inter.broker.listener.name=INTERNAL
log.dirs=/var/lib/kafka/data
controller.listener.names=CONTROLLER
auto.create.topics.enable=true
group.initial.rebalance.delay.ms=0
offsets.topic.replication.factor=1
transaction.state.log.replication.factor=1
transaction.state.log.min.isr=1
EOL

# Initialize the storage
kafka-storage.sh format -t $KAFKA_CLUSTER_ID -c "$CONFIG_FILE"

# Initialize Kafka on second run
/opt/bitnami/scripts/kafka/run.sh &

# Get PID of Kafka process
KAFKA_PID=$!

# Wait until Kafka is available
echo "Waiting for Kafka to be available..."
while ! nc -z localhost 9092; do
  sleep 1
done

echo "Kafka is available. Creating topics..."

# Create topics
kafka-topics.sh --create --bootstrap-server localhost:9092 --topic getUsersPromise --partitions 1 --replication-factor 1
kafka-topics.sh --create --bootstrap-server localhost:9092 --topic getUsersObservable --partitions 1 --replication-factor 1
kafka-topics.sh --create --bootstrap-server localhost:9092 --topic printUsers --partitions 1 --replication-factor 1

echo "Topics created."

# Wait for Kafka to be available
wait $KAFKA_PID
