import { Kafka, logLevel, Consumer, Partitioners } from 'kafkajs';
import { Order, OrderItem } from '../models/order';
import { OrderProcessor } from './orderProcessor';

export class KafkaService {
    private kafka: Kafka;
    private producer: any;
    private consumer: Consumer;

    constructor() {
        this.kafka = new Kafka({
            clientId: 'app',
            brokers: ['localhost:9092'],
            logLevel: logLevel.ERROR // Set log level to ERROR to reduce console clutter
        });
        this.producer = this.kafka.producer({createPartitioner: Partitioners.DefaultPartitioner});
        this.consumer = this.kafka.consumer({ groupId: 'order-group' });
    }

    async connectProducer() {
        await this.producer.connect();
    }

    async sendMessage(topic: string, message: string): Promise<void> {
        await this.producer.send({
            topic,
            messages: [{ value: message }],
        });
    }

    async disconnectProducer() {
        await this.producer.disconnect();
    }

    async connectConsumer() {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: 'order-topic', fromBeginning: true });
    }

    async disconnectConsumer() {
        await this.consumer.disconnect();
    }

    async processMessages(orderProcessor: OrderProcessor): Promise<void> {
        await this.connectConsumer();
        console.log('Consumer connected. Listening for messages...');
    
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (message.value) {
                    try {
                        const orderData = JSON.parse(message.value.toString());
                        const order = new Order(orderData.orderId, orderData.customerId);
                        orderData.items.forEach((item: { itemId: string; price: number; quantity: number; }) => {
                            order.addItem(new OrderItem(item.itemId, item.price, item.quantity))
                        });
                        const processingResult = await orderProcessor.processOrder(order);
                        console.log(processingResult);
                    } catch (error) {
                        console.error(`Error processing message: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                } else {
                    console.error(`Invalid message received`);
                }
            },
        });
    }
}
