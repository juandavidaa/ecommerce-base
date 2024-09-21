FROM bitnami/kafka-exporter:latest

# Cambiar a root para instalar netcat
USER root

# Instalar netcat
RUN apt-get update && apt-get install -y netcat-openbsd

# Copiar el script wait-for-kafka.sh al contenedor
COPY wait-for-kafka.sh /wait-for-kafka.sh

# Dar permisos de ejecución
RUN chmod +x /wait-for-kafka.sh

# Cambiar de nuevo al usuario predeterminado
USER 1001

# Establecer el punto de entrada
ENTRYPOINT ["/wait-for-kafka.sh", "kafka", "29092", "/opt/bitnami/kafka-exporter/bin/kafka_exporter"]
