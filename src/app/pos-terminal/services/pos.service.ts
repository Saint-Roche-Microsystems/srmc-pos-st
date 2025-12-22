import { Injectable, signal, computed, inject } from '@angular/core';
import { Product, CartItem } from '../../shared/models/product';
import { ApiService } from '../../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class PosService {
    private apiService = inject(ApiService);
    private _products = signal<Product[]>([]);
    private _cart = signal<CartItem[]>([]);

    products = computed(() => this._products());
    cart = computed(() => this._cart());

    constructor() {
        this.loadProducts();
    }

    private loadProducts() {
        this.apiService.get<Product[]>('products').subscribe({
            next: (products) => this._products.set(products),
            error: (err) => console.error('Failed to load products', err)
        });
    }

    cartTotal = computed(() =>
        this._cart().reduce((acc, item) => acc + (item.price * item.quantity), 0)
    );

    cartCount = computed(() =>
        this._cart().reduce((acc, item) => acc + item.quantity, 0)
    );

    addToCart(product: Product) {
        this._cart.update(items => {
            const existing = items.find(i => i.id === product.id);
            if (existing) {
                return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...items, { ...product, quantity: 1 }];
        });
    }

    removeFromCart(productId: string) {
        this._cart.update(items => items.filter(i => i.id !== productId));
    }

    updateQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        this._cart.update(items =>
            items.map(i => i.id === productId ? { ...i, quantity } : i)
        );
    }

    clearCart() {
        this._cart.set([]);
    }

    addProduct(product: Omit<Product, 'id'>) {
        this.apiService.post<Product>('products', product).subscribe({
            next: (newProduct) => {
                this._products.update(items => [...items, newProduct]);
            },
            error: (err) => console.error('Failed to add product', err)
        });
    }

    deleteProduct(productId: string) {
        this.apiService.delete(`products/${productId}`).subscribe({
            next: () => {
                this._products.update(items => items.filter(p => p.id !== productId));
                this.removeFromCart(productId);
            },
            error: (err) => console.error('Failed to delete product', err)
        });
    }

    checkout() {
        const order = {
            orderItems: this._cart().map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            total: this.cartTotal()
        };

        this.apiService.post('orders', order).subscribe({
            next: () => {
                console.log('Order processed successfully');
                this.clearCart();
                this.loadProducts(); // Fresh stock levels
            },
            error: (err) => console.error('Checkout failed', err)
        });
    }
}

