import express from "express";
import { KafkaClient, Producer, Consumer } from "kafka-node";
import { handleObservableRequest } from "./Observables.js";
import { handlePromiseRequest } from "./Promises.js";

const app = express();
const PORT = 3000;

// Conectar con Kafka
const kafkaClient = new KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new Producer(kafkaClient);
const consumer = new Consumer(
	kafkaClient,
	[{ topic: "request_topic", partition: 0 }],
	{ autoCommit: true }
);

producer.on("ready", () => {
	console.log("Kafka Producer está listo");
});

producer.on("error", (err) => {
	console.error("Error en el Kafka Producer:", err);
});

consumer.on("error", (err) => {
	console.error("Error en el Kafka Consumer:", err);
});

// Middleware para enviar las solicitudes a Kafka
app.use("/observable", (req, res) => {
	const requestEvent = {
		route: "observable",
		limite: req.query.limite || 1000,
	};

	producer.send(
		[{ topic: "request_topic", messages: JSON.stringify(requestEvent) }],
		(err) => {
			if (err) {
				console.error("Error enviando evento a Kafka:", err);
				res.status(500).send("Error enviando evento a Kafka");
			} else {
				renderTable(res);
			}
		}
	);
});

app.use("/promise", (req, res) => {
	const requestEvent = {
		route: "promise",
		limite: req.query.limite || 1000,
		response: res,
	};
	producer.send(
		[{ topic: "request_topic", messages: JSON.stringify(requestEvent) }],
		(err) => {
			if (err) {
				console.error("Error enviando evento a Kafka:", err);
				res.status(500).send("Error enviando evento a Kafka");
			} else {
				renderTable(res);
			}
		}
	);
});

// Kafka Consumer para procesar las solicitudes
consumer.on("message", async (message) => {
	const event = JSON.parse(message.value);
	const res = event.response;
	const limite = event.limite;
	let response;
	if (event.route === "observable") {
		response = handleObservableRequest(limite, res);
	} else if (event.route === "promise") {
		response = await handlePromiseRequest(limite, res);
	}
	producer.send([{ topic: "response_topic", messages: response }], (err) => {
		if (err) {
			console.error("Error enviando la respuesta a Kafka:", err);
		} else {
			console.log("Respuesta enviada al response_topic");
		}
	});
});

function renderTable(res) {
	const responseConsumer = new Consumer(
		kafkaClient,
		[{ topic: "response_topic", partition: 0 }],
		{ autoCommit: true }
	);

	responseConsumer.on("message", (message) => {
		console.log("Datos recibidos del consumer:", users);
        res.send(message.value);
        res.end();
	});

	responseConsumer.on("error", (err) => {
		console.error("Error en el response consumer:", err);
        res.send(err);
	});
}

app.listen(PORT, () => {
	console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
