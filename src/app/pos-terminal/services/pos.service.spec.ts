import { TestBed } from '@angular/core/testing';
import { PosService } from './pos.service';
import { ApiService } from '../../core/services/api.service';
import { of } from 'rxjs';
import { Product } from '../../shared/models/product';

describe('PosService', () => {
    let service: PosService;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;

    const mockProducts: Product[] = [
        { id: '1', name: 'Coffee', price: 5, stock: 10 },
        { id: '2', name: 'Tea', price: 3, stock: 5 }
    ];

    beforeEach(() => {
        const spy = jasmine.createSpyObj('ApiService', [
            'get',
            'post',
            'delete',
            'put'
        ]);

        TestBed.configureTestingModule({
            providers: [
                PosService,
                { provide: ApiService, useValue: spy }
            ]
        });

        apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
        apiServiceSpy.get.and.returnValue(of(mockProducts));

        service = TestBed.inject(PosService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should load products on initialization', () => {
        expect(apiServiceSpy.get).toHaveBeenCalledWith('products');
        expect(service.products()).toEqual(mockProducts);
    });

    describe('Cart Management', () => {

        it('should add a product to the cart', () => {
            service.addToCart(mockProducts[0]);

            expect(service.cart().length).toBe(1);
            expect(service.cart()[0].quantity).toBe(1);
            expect(service.cartCount()).toBe(1);

            // 5 + 16% = 5.8
            expect(service.cartTotal()).toBeCloseTo(5.8, 2);
        });

        it('should increment quantity if product already in cart', () => {
            service.addToCart(mockProducts[0]);
            service.addToCart(mockProducts[0]);

            expect(service.cart().length).toBe(1);
            expect(service.cart()[0].quantity).toBe(2);
            expect(service.cartCount()).toBe(2);

            // 10 + 16% = 11.6
            expect(service.cartTotal()).toBeCloseTo(11.6, 2);
        });

        it('should update quantity correctly', () => {
            service.addToCart(mockProducts[0]);
            service.updateQuantity('1', 5);

            // 25 + 16% = 29
            expect(service.cart()[0].quantity).toBe(5);
            expect(service.cartTotal()).toBeCloseTo(29, 2);
        });

        it('should remove product if quantity updated to 0', () => {
            service.addToCart(mockProducts[0]);
            service.updateQuantity('1', 0);

            expect(service.cart().length).toBe(0);
            expect(service.cartTotal()).toBe(0);
        });

        it('should remove product from cart', () => {
            service.addToCart(mockProducts[0]);
            service.addToCart(mockProducts[1]);

            service.removeFromCart('1');

            expect(service.cart().length).toBe(1);
            expect(service.cart()[0].id).toBe('2');
        });

        it('should clear the cart', () => {
            service.addToCart(mockProducts[0]);
            service.clearCart();

            expect(service.cart().length).toBe(0);
            expect(service.cartTotal()).toBe(0);
        });
    });

    describe('API Actions', () => {

        it('should call api to add product and update signal', () => {
            const newProductDto = { name: 'Latte', price: 6, stock: 20 };
            const savedProduct = { ...newProductDto, id: '3' };

            apiServiceSpy.post.and.returnValue(of(savedProduct));

            service.addProduct(newProductDto);

            expect(apiServiceSpy.post).toHaveBeenCalledWith('products', newProductDto);
            expect(service.products()).toContain(savedProduct);
        });

        it('should call api to delete product and update signal/cart', () => {
            apiServiceSpy.delete.and.returnValue(of({}));

            service.addToCart(mockProducts[0]);
            service.deleteProduct('1');

            expect(apiServiceSpy.delete).toHaveBeenCalledWith('products/1');
            expect(service.products().find(p => p.id === '1')).toBeUndefined();
            expect(service.cart().find(i => i.id === '1')).toBeUndefined();
        });

        it('should clear cart and reload products on successful checkout', () => {
            service.addToCart(mockProducts[0]);

            apiServiceSpy.post.and.returnValue(of({ success: true }));
            apiServiceSpy.get.calls.reset();

            service.checkout();

            expect(apiServiceSpy.post).toHaveBeenCalled();
            expect(service.cart().length).toBe(0);
            expect(apiServiceSpy.get).toHaveBeenCalledWith('products');
        });
    });
});
