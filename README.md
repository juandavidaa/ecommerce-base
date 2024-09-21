
# Backend Microservices with Kafka and Redis

This project is a basic backend microservices architecture using Kafka as a message broker and Redis for caching. It includes two main endpoints: one for handling promises and another for observables. The system is designed to handle concurrent user requests and efficiently process them using Kafka.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Kafka Topics](#kafka-topics)
- [Docker Setup](#docker-setup)
- [Prometheus Monitoring](#prometheus-monitoring)
- [License](#license)

## Project Overview

This project demonstrates how to build a scalable microservices backend that uses Kafka for message queuing and Redis for caching. The main goal is to compare the performance of observables versus promises when handling large volumes of user data.

### Features
- Microservices architecture.
- Kafka for message queuing.
- Redis caching.
- Prometheus metrics.
- Modular and extensible structure for scaling.

## Technologies Used

- Node.js
- KafkaJS
- Redis
- Docker
- Prometheus
- Winston (for logging)
- UUID (for generating unique request IDs)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables by creating a `.env` file based on the provided `.env.example`.

4. Ensure you have Docker installed for running Kafka, Redis, and Prometheus.

## Running the Application

1. **Running the app locally**:
   ```bash
   npm start
   ```

2. **Running the app with Docker**:
   First, build the Docker containers:
   ```bash
   docker-compose up --build
   ```

3. Access the API endpoints at `http://localhost:3001`.

## API Endpoints

### Promise Endpoint
- **URL**: `/promise`
- **Method**: GET
- **Description**: Sends a request to Kafka to fetch user data using promises.

### Observable Endpoint
- **URL**: `/observable`
- **Method**: GET
- **Description**: Sends a request to Kafka to fetch user data using observables.

## Kafka Topics

- `getUsersPromise`: Processes requests for promises.
- `getUsersObservable`: Processes requests for observables.
- `printUsers`: Used to return the result of the processed requests.

## Docker Setup

The project is Dockerized for easy deployment. The Docker setup includes Kafka, Redis, Prometheus, and the Node.js app.

To start all services with Docker:
```bash
docker-compose up
```

This will set up all required services and expose the following ports:
- **Kafka**: `9092`
- **Redis**: `6379`
- **Prometheus**: `9090`
- **Grafana** (optional): `3000`

## Prometheus Monitoring

Prometheus is used to monitor the system's performance. Metrics for Kafka and Redis are automatically collected. To access the Prometheus dashboard, navigate to:
```bash
http://localhost:9090
```

## License

This project is licensed under the MIT License.
