import kafka from '../config.js';
import logger from '../../../utils/logger.js';
import { handlePromiseRequest } from '../../../services/Promises.js';


let consumer;

(async () => {
    // Consumer 'getUsersPromise'
	consumer = kafka.consumer({
		groupId: "unique-group-promise",
	});
	await consumer.connect();
	await consumer.subscribe({
		topic: "getUsersPromise",
		fromBeginning: true,
	});

	consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			logger.info("get from consumerGetUsersPromise");

			try {
				const limit = message.value;
	            await handlePromiseRequest(limit);

			} catch (error) {
				logger.error(
					`Error procesando mensaje de ${topic}: ${error.message}`
				);
			}
		},
	});

    return consumer;
})();

export default consumer;

