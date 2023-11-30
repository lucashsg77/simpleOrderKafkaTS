import { Order, OrderItem } from '../src/models/order';
import { KafkaService } from '../src/services/kafkaService';
import { OrderProcessor } from '../src/services/orderProcessor';

describe('Order Processing', () => {
    let kafkaService: KafkaService;
    let orderProcessor: OrderProcessor;

    beforeAll(async () => {
        kafkaService = new KafkaService();
        await kafkaService.connect();
        orderProcessor = new OrderProcessor(kafkaService);
    });

    afterAll(async () => {
        await kafkaService.disconnect();
    });

    test('should process valid orders correctly', async () => {
        const order = new Order('order123', 'customer123');
        order.addItem(new OrderItem('item1', 100, 2));

        await orderProcessor.processOrder(order);

        expect(order.getTotal()).toBe(200);
        expect(order.status).toBe('processed');
    });
    test('should fail to process an order with invalid item data', async () => {
        const order = new Order('order124', 'customer124');
        expect(() => {
            order.addItem(new OrderItem('item2', -50, 3));
        }).toThrow("Invalid item quantity or price");
    
        expect(order.status).toBe('pending');
    });
    test('should process a regular order without discounts correctly', async () => {
        const order = new Order('order125', 'customer125');
        order.addItem(new OrderItem('item3', 100, 1));
    
        await orderProcessor.processOrder(order);
    
        expect(order.getTotal()).toBe(100);
        expect(order.status).toBe('processed');
    });
    
});