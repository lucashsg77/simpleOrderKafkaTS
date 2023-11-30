import { KafkaService } from './services/kafkaService';
import { OrderProcessor } from './services/orderProcessor';

async function runConsumer() {
    const kafkaService = new KafkaService();
    const orderProcessor = new OrderProcessor();

    try {
        await kafkaService.processMessages(orderProcessor);
    } catch (error) {
        console.error('Error in consumer:', error instanceof Error ? error.message : 'Unknown error');
        await kafkaService.disconnectConsumer();
    }
}

runConsumer();