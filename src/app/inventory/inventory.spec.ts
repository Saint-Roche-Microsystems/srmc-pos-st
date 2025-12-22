import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryComponent } from './inventory';
import { PosService } from '../pos-terminal/services/pos.service';
import { signal } from '@angular/core';
import { Product } from '../shared/models/product';
import { By } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReactiveFormsModule } from '@angular/forms';

describe('InventoryComponent', () => {
    let component: InventoryComponent;
    let fixture: ComponentFixture<InventoryComponent>;
    let mockPosService: any;

    const mockProducts: Product[] = [
        { id: '1', name: 'Coffee', price: 5, stock: 10 },
        { id: '2', name: 'Tea', price: 3, stock: 50 }
    ];

    beforeEach(async () => {
        mockPosService = {
            products: signal(mockProducts),
            addProduct: jasmine.createSpy('addProduct'),
            deleteProduct: jasmine.createSpy('deleteProduct')
        };

        await TestBed.configureTestingModule({
            imports: [InventoryComponent, ReactiveFormsModule],
            providers: [
                { provide: PosService, useValue: mockPosService },
                provideAnimationsAsync()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(InventoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render products in the table', () => {
        const rows = fixture.debugElement.queryAll(By.css('p-table tr'));
        // Header row + 2 data rows
        expect(rows.length).toBe(3);
        expect(rows[1].nativeElement.textContent).toContain('Coffee');
        expect(rows[2].nativeElement.textContent).toContain('Tea');
    });

    it('should show dialog when clicking New Product button', () => {
        const newProductBtn = fixture.debugElement.query(By.css('p-button[label="New Product"]'));
        newProductBtn.triggerEventHandler('click', null);

        expect(component.displayDialog).toBeTrue();
    });

    it('should validate the form', () => {
        component.showDialog();
        const form = component.productForm;

        expect(form.valid).toBeFalse();

        form.patchValue({
            name: 'Cookie',
            price: 2.5,
            stock: 10
        });

        expect(form.valid).toBeTrue();
    });

    it('should call addProduct and close dialog on valid save', () => {
        component.showDialog();
        component.productForm.patchValue({
            name: 'Cookie',
            price: 2.5,
            stock: 10,
            image: 'http://example.com/img.jpg'
        });

        component.saveProduct();

        expect(mockPosService.addProduct).toHaveBeenCalledWith({
            name: 'Cookie',
            price: 2.5,
            stock: 10,
            image: 'http://example.com/img.jpg'
        });
        expect(component.displayDialog).toBeFalse();
    });

    it('should call deleteProduct when clicking the delete button', () => {
        // Find delete button in first data row
        const deleteBtn = fixture.debugElement.query(By.css('p-button[severity="danger"]'));
        deleteBtn.triggerEventHandler('click', null);

        expect(mockPosService.deleteProduct).toHaveBeenCalledWith('1');
    });

    it('should display correct stock status', () => {
        const statusRows = fixture.debugElement.queryAll(By.css('.text-xs.font-bold.uppercase.tracking-tighter'));

        // Product 1 has 10 stock -> "Low Stock"
        expect(statusRows[0].nativeElement.textContent).toContain('Low Stock');

        // Product 2 has 50 stock -> "Healthy"
        expect(statusRows[1].nativeElement.textContent).toContain('Healthy');
    });
});
