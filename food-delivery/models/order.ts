export interface OrderItem {
    id: number;
    img: string;
    quantity: number;
    price: number;
    name: string;
}

export interface OrderUser {
    orderItems: Array<OrderItem>;
    totalAmount: number
}

export interface HistoryOrders {
    "orderItems": Array<OrderItem>,
    "createdAt": number,
    "updatedAt": number
}