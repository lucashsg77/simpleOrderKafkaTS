export class OrderItem {
    constructor(public itemId: string, public price: number, public quantity: number) {}

    get total() {
        return this.price * this.quantity;
    }
}

export class Order {
    private items: OrderItem[] = [];
    public status: 'pending' | 'processed' | 'failed' = 'pending';

    constructor(public orderId: string, public customerId: string) {}

    public getItems(): ReadonlyArray<OrderItem> {
        return this.items;
    }    

    addItem(item: OrderItem): void {
        if (item.quantity <= 0 || item.price <= 0) {
            throw new Error("Invalid item quantity or price");
        }
        this.items.push(item);
    }

    getTotal(): number {
        return this.items.reduce((total, item) => total + item.total, 0);
    }

    getItemsCount(): number {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    applyDiscount(discountRate: number): void {
        this.items.forEach(item => {
            item.price -= item.price * discountRate;
        });
    }
}
