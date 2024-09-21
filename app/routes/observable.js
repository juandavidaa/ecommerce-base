import { Router } from "express";

import logger from "../utils/logger.js";
import { Response } from "../utils/response.js";
import { apiProducer } from "../adapters/kafka/index.js";

const router = Router();

router.get("/users", async (req, res) => {

	const limit = req.query.limit || 1000;
    
    try {
		await apiProducer.send({
			topic: "getUsersObservable",
			messages: [{ value: limit }],
		});

		logger.info(
			`Message sent to getUsersObservable`
		);
	} catch (error) {
		logger.error(`Error sending event to kafka: ${error.message}`);
		Response.error("Error sending event to kafka");
	}
});

export default router;