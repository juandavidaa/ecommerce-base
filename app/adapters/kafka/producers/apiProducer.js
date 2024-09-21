import kafka from '../config.js';
import { Partitioners } from 'kafkajs';
import logger from '../../../utils/logger.js';

let producer;


(async () => {
    if (!producer) {
		producer = kafka.producer({
			createPartitioner: Partitioners.LegacyPartitioner,
		});
		await producer.connect();
		logger.info("Kafka Producer connected");
	}
	return producer;
})();

export default producer;
