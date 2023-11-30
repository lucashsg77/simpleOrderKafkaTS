import { Order, OrderItem } from '../models/order';

export class OrderProcessor {
    constructor() {}

    private validateStock(item: OrderItem): boolean {
        return item.quantity <= 10;
    }

    private applyDiscounts(order: Order): void {
        const totalItems = order.getItemsCount();
        const isPremiumMember = order.customerId === 'premium123';

        if (totalItems > 5) {
            order.applyDiscount(0.05); // 5% discount for bulk orders
        }

        if (isPremiumMember) {
            order.applyDiscount(0.1); // Additional 10% discount for premium members
        }
    }

    async processOrder(order: Order): Promise<string> {
        try {
            for (const item of order.getItems()) {
                if (!this.validateStock(item)) {
                    throw new Error(`Item ${item.itemId} is out of stock`);
                }
            }

            this.applyDiscounts(order);
            order.status = 'processed';
            return `Order ${order.orderId} processed successfully`;
        } catch (error: unknown) {
            order.status = 'failed';
            const errorMessage = error instanceof Error ? error.message : 'unknown error';
            return `Order ${order.orderId} processing failed: ${errorMessage}`;
        }
    }
}
