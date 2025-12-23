import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrdersService } from './order.service';
import { ApiService } from '../../core/services/api.service';
import { of, throwError } from 'rxjs';
import { Order } from '../../shared/models/order';

describe('OrdersService', () => {
  let service: OrdersService;
  let apiSpy: jasmine.SpyObj<ApiService>;

  const mockOrders: Order[] = [
    {
      userId: 'user1',
      orderItems: [
        { productId: { id: 'p1', name: 'Product 1' }, quantity: 2, price: 10 }
      ],
      total: 20,
      createdAt: '2025-12-23T10:00:00.000Z',
      updatedAt: '2025-12-23T10:00:00.000Z'
    },
    {
      userId: 'user2',
      orderItems: [
        { productId: { id: 'p2', name: 'Product 2' }, quantity: 1, price: 15 }
      ],
      total: 15,
      createdAt: '2025-12-23T11:00:00.000Z',
      updatedAt: '2025-12-23T11:00:00.000Z'
    }
  ];

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('ApiService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        OrdersService,
        { provide: ApiService, useValue: apiSpy }
      ]
    });

    // IMPORTANTE: setear el spy antes de instanciar el servicio
    apiSpy.get.and.returnValue(of(mockOrders));

    service = TestBed.inject(OrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load orders and sort by createdAt descending', fakeAsync(() => {
    tick(); // Simula la suscripción al API

    const orders = service.orders();
    expect(orders.length).toBe(2);
    expect(orders[0].userId).toBe('user2'); // Más reciente primero
    expect(service.loading()).toBeFalse();
    expect(service.error()).toBeNull();
  }));


  it('should handle error when API fails', fakeAsync(() => {
    apiSpy.get.and.returnValue(throwError(() => new Error('API error')));
    service.refresh();
    tick();
    expect(service.loading()).toBeFalse();
    expect(service.error()).toBe('Error loading orders');
  }));

  it('refresh should call loadOrders again', fakeAsync(() => {
    const spyLoad = spyOn<any>(service, 'loadOrders').and.callThrough();
    service.refresh();
    tick();
    expect(spyLoad).toHaveBeenCalled();
  }));
});
