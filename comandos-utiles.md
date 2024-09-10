
# Hub de Comandos Útiles

---

## 1. Encontrar qué proceso está usando un puerto específico (Windows)

- **Verificar qué proceso está usando un puerto específico**:
  ```bash
  netstat -aon | findstr :<puerto>
  ```

  - Ejemplo para el puerto 3306:
    ```bash
    netstat -aon | findstr :3306
    ```

- **Encontrar el nombre del proceso basado en el PID (Proceso ID)**:
  ```bash
  tasklist | findstr <PID>
  ```

  - Ejemplo para el PID 1234:
    ```bash
    tasklist | findstr 1234
    ```

- **Terminar un proceso por PID**:
  ```bash
  taskkill /F /PID <PID>
  ```

  - Ejemplo:
    ```bash
    taskkill /F /PID 1234
    ```

---

## 2. Comandos básicos de Docker

- **Listar contenedores en ejecución**:
  ```bash
  docker ps
  ```

- **Listar todos los contenedores (incluso los detenidos)**:
  ```bash
  docker ps -a
  ```

- **Iniciar un contenedor**:
  ```bash
  docker start <nombre_del_contenedor>
  ```

- **Detener un contenedor**:
  ```bash
  docker stop <nombre_del_contenedor>
  ```

- **Eliminar un contenedor**:
  ```bash
  docker rm <nombre_del_contenedor>
  ```

- **Crear y ejecutar un contenedor**:
  ```bash
  docker run --name <nombre_del_contenedor> -d <imagen>
  ```

- **Inspeccionar un contenedor** (ver detalles del contenedor):
  ```bash
  docker inspect <nombre_del_contenedor>
  ```

---

## 3. Comandos para manejar volúmenes en Docker

- **Listar volúmenes de Docker**:
  ```bash
  docker volume ls
  ```

- **Eliminar un volumen de Docker**:
  ```bash
  docker volume rm <nombre_del_volumen>
  ```

- **Inspeccionar un volumen de Docker**:
  ```bash
  docker volume inspect <nombre_del_volumen>
  ```

---

## 4. Comandos básicos de MySQL (Línea de comandos de MySQL)

- **Conectarse a MySQL desde el contenedor (Docker)**:
  ```bash
  docker exec -it <nombre_del_contenedor> mysql -u root -p
  ```

- **Listar bases de datos**:
  ```sql
  SHOW DATABASES;
  ```

- **Usar una base de datos**:
  ```sql
  USE <nombre_de_la_base_de_datos>;
  ```

- **Mostrar tablas en una base de datos**:
  ```sql
  SHOW TABLES;
  ```

- **Mostrar la estructura de una tabla**:
  ```sql
  DESCRIBE <nombre_de_la_tabla>;
  ```

- **Crear una tabla**:
  ```sql
  CREATE TABLE <nombre_de_la_tabla> (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100),
      email VARCHAR(100),
      edad INT
  );
  ```

---

## 5. Comandos de control de red y puertos (Windows/Linux)

- **Verificar puertos en uso y conexiones de red** (Windows):
  ```bash
  netstat -aon
  ```

- **Verificar puertos en uso y conexiones de red** (Linux):
  ```bash
  sudo netstat -tuln
  ```

- **Ver información de red y configuración de IP** (Windows):
  ```bash
  ipconfig
  ```

- **Ver información de red y configuración de IP** (Linux):
  ```bash
  ifconfig
  ```

---

## 6. Comandos útiles de Git

- **Ver el estado del repositorio**:
  ```bash
  git status
  ```

- **Agregar cambios al área de staging**:
  ```bash
  git add <archivo>
  ```

- **Hacer commit de los cambios**:
  ```bash
  git commit -m "Descripción del cambio"
  ```

- **Ver el historial de commits**:
  ```bash
  git log
  ```

- **Clonar un repositorio**:
  ```bash
  git clone <url_del_repositorio>
  ```

- **Subir cambios al repositorio remoto**:
  ```bash
  git push
  ```

---

## 7. Manipulación de archivos en la terminal

- **Mostrar el contenido de un archivo** (Windows/Linux):
  ```bash
  cat <nombre_del_archivo>
  ```

- **Mover un archivo**:
  ```bash
  mv <archivo> <destino>
  ```

- **Eliminar un archivo**:
  ```bash
  rm <archivo>
  ```

---
