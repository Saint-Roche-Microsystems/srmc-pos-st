import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Order } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private api = inject(ApiService);

  private _orders = signal<Order[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  orders = computed(() => this._orders());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this._loading.set(true);
    this._error.set(null);

    this.api.get<Order[]>('orders/my').subscribe({
      next: orders => {
        this._orders.set(
          orders.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
        );
        this._loading.set(false);
      },
      error: err => {
        console.error(err);
        this._error.set('Error loading orders');
        this._loading.set(false);
      }
    });
  }

  refresh() {
    this.loadOrders();
  }
}
