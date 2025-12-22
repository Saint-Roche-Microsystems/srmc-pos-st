export interface Product {
    id: string;
    name: string;
    price: number;
    image?: string;
    stock: number;
}

export interface CartItem extends Product {
    quantity: number;
}
