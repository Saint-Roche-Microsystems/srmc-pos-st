import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../../shared/models/product';

@Injectable({
    providedIn: 'root'
})
export class PosService {
    private _products = signal<Product[]>([
        { id: '1', name: 'Premium Coffee', price: 4.50, category: 'Beverages', stock: 50, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop' },
        { id: '2', name: 'Avocado Toast', price: 12.00, category: 'Food', stock: 20, image: 'https://www.allrecipes.com/thmb/8NccFzsaq0_OZPDKmf7Yee-aG78=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AvocadoToastwithEggFranceC4x3-bb87e3bbf1944657b7db35f1383fabdb.jpg' },
        { id: '3', name: 'Green Smoothie', price: 7.50, category: 'Beverages', stock: 30, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop' },
        { id: '4', name: 'Blueberry Muffin', price: 3.75, category: 'Bakery', stock: 15, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop' },
        { id: '5', name: 'Croissant', price: 3.25, category: 'Bakery', stock: 25, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop' },
        { id: '6', name: 'Artisan Sourdough', price: 8.00, category: 'Bakery', stock: 10, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop' },
    ]);

    private _cart = signal<CartItem[]>([]);

    products = computed(() => this._products());
    cart = computed(() => this._cart());

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

    checkout() {
        // Process payment logic would go here
        console.log('Processing checkout for total:', this.cartTotal());
        this.clearCart();
        // In a real app, we would update stock levels here
    }
}
