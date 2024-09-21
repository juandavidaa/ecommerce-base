import kafka from '../config.js';
import logger from '../../../utils/logger.js';
import { handleObservableRequest } from '../../../services/Observables.js';


let consumer;

(async () => {
    // Consumer 'getUsersPromise'
	consumer = kafka.consumer({
		groupId: "unique-group-observable",
	});
	await consumer.connect();
	await consumer.subscribe({
		topic: "getUsersObservable",
		fromBeginning: true,
	});

	consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			logger.info("get from consumerGetUsersObservable");

			try {
				const limit = message.value;
	            await handleObservableRequest(limit);

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

