import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryComponent } from './inventory';
import { PosService } from '../pos-terminal/services/pos.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { Product } from '../shared/models/product';

/* =======================
   Mock del PosService
======================= */
class PosServiceMock {
  private _products = signal<Product[]>([
    {
      id: '1',
      name: 'Coffee',
      price: 5,
      stock: 20,
      image: ''
    }
  ]);

  products = this._products.asReadonly();

  addProduct = jasmine.createSpy('addProduct');
  editProduct = jasmine.createSpy('editProduct');
  deleteProduct = jasmine.createSpy('deleteProduct');
}

describe('InventoryComponent', () => {
  let component: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;
  let posService: PosServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InventoryComponent,
        ReactiveFormsModule,
        NoopAnimationsModule // evita problemas con PrimeNG
      ],
      providers: [
        { provide: PosService, useClass: PosServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    posService = TestBed.inject(PosService) as unknown as PosServiceMock;
    fixture.detectChanges();
  });

  /* =======================
     Creación
  ======================= */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* =======================
     showDialog()
  ======================= */
  it('should open dialog in create mode and reset form', () => {
    component.showDialog();

    expect(component.displayDialog).toBeTrue();
    expect(component.isEditMode).toBeFalse();
    expect(component.editingProductId).toBeNull();

    expect(component.productForm.value).toEqual({
      name: '',
      price: 0,
      stock: 0,
      image: ''
    });
  });

  /* =======================
     showEditDialog()
  ======================= */
  it('should open dialog in edit mode and patch form values', () => {
    const product: Product = {
      id: '99',
      name: 'Laptop',
      price: 1200,
      stock: 10,
      image: 'img.jpg'
    };

    component.showEditDialog(product);

    expect(component.isEditMode).toBeTrue();
    expect(component.editingProductId).toBe('99');
    expect(component.displayDialog).toBeTrue();

    expect(component.productForm.value).toEqual({
      name: 'Laptop',
      price: 1200,
      stock: 10,
      image: 'img.jpg'
    });
  });

  /* =======================
     saveProduct() - ADD
  ======================= */
  it('should call addProduct when saving a new product', () => {
    component.showDialog();

    component.productForm.setValue({
      name: 'Tea',
      price: 3,
      stock: 15,
      image: ''
    });

    component.saveProduct();

    expect(posService.addProduct).toHaveBeenCalledWith({
      name: 'Tea',
      price: 3,
      stock: 15,
      image: undefined
    });

    expect(component.displayDialog).toBeFalse();
  });

  /* =======================
     saveProduct() - EDIT
  ======================= */
  it('should call editProduct when editing an existing product', () => {
    const product: Product = {
      id: '10',
      name: 'Sugar',
      price: 2,
      stock: 30
    };

    component.showEditDialog(product);

    component.productForm.patchValue({
      price: 2.5,
      stock: 25
    });

    component.saveProduct();

    expect(posService.editProduct).toHaveBeenCalledWith('10', {
      name: 'Sugar',
      price: 2.5,
      stock: 25,
      image: undefined
    });

    expect(component.displayDialog).toBeFalse();
  });

  /* =======================
     saveProduct() - INVALID
  ======================= */
  it('should NOT save if form is invalid', () => {
    component.showDialog();

    component.productForm.patchValue({
      name: '',
      price: 0,
      stock: -1
    });

    component.saveProduct();

    expect(posService.addProduct).not.toHaveBeenCalled();
    expect(posService.editProduct).not.toHaveBeenCalled();
    expect(component.displayDialog).toBeTrue();
  });

  /* =======================
     deleteProduct()
  ======================= */
  it('should call deleteProduct on service', () => {
    component.deleteProduct('123');

    expect(posService.deleteProduct).toHaveBeenCalledWith('123');
  });
});
