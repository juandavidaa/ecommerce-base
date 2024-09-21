import { Kafka, logLevel } from "kafkajs";

import dotenv from "dotenv";
dotenv.config();

const KAFKA_BROKER = process.env.KAFKA_BROKER || "192.168.1.2:9092";

const kafka = new Kafka({
	clientId: "my-app",
	brokers: [KAFKA_BROKER],
	connectionTimeout: 5000,
	logLevel: logLevel.ERROR,
	retry: { retries: 10 },
});

export default kafka;