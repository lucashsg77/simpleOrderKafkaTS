import { Order, OrderItem } from './models/order';
import { KafkaService } from './services/kafkaService';

function createRandomOrder() {
    const orderId = `order${Math.floor(Math.random() * 1000)}`;
    const customerId = `customer${Math.floor(Math.random() * 100)}`;
    const order = new Order(orderId, customerId);

    const itemCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 items
    for (let i = 0; i < itemCount; i++) {
        const itemPrice = Math.floor(Math.random() * 100) + 10; // $10 to $100
        const quantity = Math.floor(Math.random() * 4) + 1; // 1 to 4 quantity
        order.addItem(new OrderItem(`item${i}`, itemPrice, quantity));
    }
    return order;
}

async function processOrders() {
    const kafkaService = new KafkaService();
    await kafkaService.connectProducer();

    // Continuous order creation and sending to Kafka
    const intervalId = setInterval(async () => {
        const order = createRandomOrder();

        const orderMessage = JSON.stringify({
            orderId: order.orderId,
            customerId: order.customerId,
            items: order.getItems().map(item => ({
                itemId: item.itemId,
                price: item.price,
                quantity: item.quantity
            }))
        });

        await kafkaService.sendMessage('order-topic', orderMessage);
        console.log(`Order ${order.orderId} sent to Kafka`);

    }, 5000);

    // Graceful Shutdown
    process.on('SIGINT', async () => {
        clearInterval(intervalId);
        console.log('Shutting down...');
        await kafkaService.disconnectProducer();
        process.exit(0);
    });
}

processOrders().catch(error => {
    console.error('Failed to process orders:', error.message);
});

