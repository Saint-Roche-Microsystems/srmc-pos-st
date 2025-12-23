import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from './services/order.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { Order } from '../shared/models/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SkeletonModule
  ],
  providers: [DatePipe, CurrencyPipe],
  templateUrl: './orders.html'
})
export class Orders {

  private service = inject(OrdersService);
  private datePipe = inject(DatePipe);
  private currencyPipe = inject(CurrencyPipe);

  orders = this.service.orders;
  loading = this.service.loading;
  error = this.service.error;

  searchText = '';
  selectedOrder: Order | null = null;
  showDialog = false;

  get filteredOrders(): Order[] {
    if (!this.searchText) return this.orders();

    const s = this.searchText.toLowerCase();
    return this.orders().filter(o =>
      o.userId.toLowerCase().includes(s)
    );
  }

  itemsCount(order: Order): number {
    return order.orderItems.reduce((a, i) => a + i.quantity, 0);
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMM d, y, h:mm a') ?? '';
  }

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2') ?? '';
  }

  view(order: Order) {
    this.selectedOrder = order;
    this.showDialog = true;
  }

  close() {
    this.selectedOrder = null;
    this.showDialog = false;
  }

  refresh() {
    this.service.refresh();
  }
}
