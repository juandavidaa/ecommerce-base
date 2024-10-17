FROM bitnami/kafka:latest

# Cambiar a root para instalar paquetes y ajustar permisos
USER root

# Instalar uuidgen y netcat
RUN apt-get update && apt-get install -y uuid-runtime netcat-openbsd

# Crear el directorio y ajustar permisos
RUN mkdir -p /var/lib/kafka && chmod -R 777 /var/lib/kafka

# Copiar el script de inicialización al contenedor
COPY init.sh /etc/kafka/init.sh

# Asegurar permisos de ejecución para el script
RUN chmod +x /etc/kafka/init.sh

# Cambiar de nuevo al usuario predeterminado de Kafka
USER 1001

# Establecer el script como entrypoint
ENTRYPOINT ["/etc/kafka/init.sh"]
