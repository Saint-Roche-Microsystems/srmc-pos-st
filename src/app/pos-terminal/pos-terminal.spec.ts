import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosTerminalComponent } from './pos-terminal';
import { PosService } from './services/pos.service';
import { signal } from '@angular/core';
import { Product, CartItem } from '../shared/models/product';
import { By } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';

describe('PosTerminalComponent', () => {
    let component: PosTerminalComponent;
    let fixture: ComponentFixture<PosTerminalComponent>;
    let mockPosService: any;

    const mockProducts: Product[] = [
        { id: '1', name: 'Coffee', price: 5, stock: 10 },
        { id: '2', name: 'Tea', price: 3, stock: 5 }
    ];

    const mockCart: CartItem[] = [
        { ...mockProducts[0], quantity: 2 }
    ];

    beforeEach(async () => {
        mockPosService = {
            products: signal(mockProducts),
            cart: signal(mockCart),
            cartCount: signal(2),
            cartTotal: signal(10),
            addToCart: jasmine.createSpy('addToCart'),
            removeFromCart: jasmine.createSpy('removeFromCart'),
            updateQuantity: jasmine.createSpy('updateQuantity'),
            clearCart: jasmine.createSpy('clearCart'),
            checkout: jasmine.createSpy('checkout')
        };

        await TestBed.configureTestingModule({
            imports: [PosTerminalComponent],
            providers: [
                { provide: PosService, useValue: mockPosService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PosTerminalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render product cards', () => {
        const cards = fixture.debugElement.queryAll(By.css('.group.relative.bg-white.rounded-3xl'));
        expect(cards.length).toBe(2);
        expect(cards[0].nativeElement.textContent).toContain('Coffee');
        expect(cards[1].nativeElement.textContent).toContain('Tea');
    });

    it('should call addToCart when product card is clicked', () => {
        const firstCard = fixture.debugElement.query(By.css('.group.relative.bg-white.rounded-3xl'));
        firstCard.triggerEventHandler('click', null);

        expect(mockPosService.addToCart).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('should display cart items in the sidebar', () => {
        const cartItems = fixture.debugElement.queryAll(By.css('.flex.items-center.gap-4.p-4.rounded-3xl'));
        expect(cartItems.length).toBe(1);
        expect(cartItems[0].nativeElement.textContent).toContain('Coffee');
        expect(cartItems[0].nativeElement.textContent).toContain('2'); // Quantity
    });

    it('should call updateQuantity when clicking increment/decrement buttons', () => {
        const decButton = fixture.debugElement.query(By.css('button i.pi-minus')).parent;
        const incButton = fixture.debugElement.query(By.css('button i.pi-plus')).parent;

        decButton?.triggerEventHandler('click', null);
        expect(mockPosService.updateQuantity).toHaveBeenCalledWith('1', 1);

        incButton?.triggerEventHandler('click', null);
        expect(mockPosService.updateQuantity).toHaveBeenCalledWith('1', 3);
    });

    it('should call clearCart when clicking the trash button', () => {
        const trashButton = fixture.debugElement.query(By.css('p-button[icon="pi pi-trash"]'));
        trashButton.triggerEventHandler('click', null);

        expect(mockPosService.clearCart).toHaveBeenCalled();
    });

    it('should call checkout when clicking the Checkout Now button', () => {
        const checkoutButton = fixture.debugElement.query(By.css('p-button[label="Checkout Now"]'));
        checkoutButton.triggerEventHandler('click', null);

        expect(mockPosService.checkout).toHaveBeenCalled();
    });
});
