#!/bin/bash

# Generar un CLUSTER_ID único si no está presente
if [ -z "$KAFKA_CLUSTER_ID" ]; then
  CLUSTER_ID=$(uuidgen)
  echo "Generated CLUSTER_ID: $CLUSTER_ID"
  export KAFKA_CLUSTER_ID=$CLUSTER_ID
fi

CONFIG_FILE="/opt/bitnami/kafka/config/server.properties"

# Crear el archivo server.properties si no existe
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Archivo $CONFIG_FILE no encontrado. Creando uno nuevo."
  touch "$CONFIG_FILE"
fi

echo "Configurando $CONFIG_FILE"

# Eliminar posibles configuraciones duplicadas
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

# Utilizar la variable de entorno EXTERNAL_HOST o establecer 'localhost' por defecto
EXTERNAL_HOST=${EXTERNAL_HOST:-localhost}

# Añadir las configuraciones actualizadas
cat <<EOL >>"$CONFIG_FILE"
process.roles=broker,controller
node.id=0
broker.id=0
controller.quorum.voters=0@kafka:9093
listeners=CONTROLLER://0.0.0.0:9093,INTERNAL://0.0.0.0:29092,EXTERNAL://0.0.0.0:9092
advertised.listeners=INTERNAL://kafka:29092,EXTERNAL://$EXTERNAL_HOST:9092
listener.security.protocol.map=CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
inter.broker.listener.name=INTERNAL
log.dirs=/var/lib/kafka/data
controller.listener.names=CONTROLLER
auto.create.topics.enable=true
# Configuraciones para habilitar el almacenamiento de estado de grupos de consumidores
group.initial.rebalance.delay.ms=0
offsets.topic.replication.factor=1
transaction.state.log.replication.factor=1
transaction.state.log.min.isr=1
EOL

# Inicializar el almacenamiento del broker para KRaft
kafka-storage.sh format -t $KAFKA_CLUSTER_ID -c "$CONFIG_FILE"

# Iniciar Kafka en segundo plano
/opt/bitnami/scripts/kafka/run.sh &

# Capturar el PID del proceso de Kafka
KAFKA_PID=$!

# Esperar a que Kafka esté listo
echo "Esperando a que Kafka esté disponible..."
while ! nc -z localhost 9092; do
  sleep 1
done

echo "Kafka está disponible. Creando tópicos..."

# Crear los tópicos necesarios
kafka-topics.sh --create --bootstrap-server localhost:9092 --topic getUsersPromise --partitions 1 --replication-factor 1
kafka-topics.sh --create --bootstrap-server localhost:9092 --topic getUsersObservable --partitions 1 --replication-factor 1
kafka-topics.sh --create --bootstrap-server localhost:9092 --topic printUsers --partitions 1 --replication-factor 1

echo "Tópicos creados."

# Esperar a que el proceso de Kafka termine
wait $KAFKA_PID
