import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosService } from '../pos-terminal/services/pos.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../shared/models/product';


@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    DialogModule,
    InputNumberModule,
    ReactiveFormsModule
  ],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class InventoryComponent {
  posService = inject(PosService);
  private fb = inject(FormBuilder);

  displayDialog = false;
  isEditMode = false;
  editingProductId: string | null = null;

  productForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    image: ['']
  });

  showDialog() {
    this.isEditMode = false;
    this.editingProductId = null;
    this.productForm.reset({
      name: '',
      price: 0,
      stock: 0,
      image: ''
    });
    this.displayDialog = true;
  }

  showEditDialog(product: Product) {
    this.isEditMode = true;
    this.editingProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image || ''
    });
    this.displayDialog = true;
  }

  saveProduct() {
    if (this.productForm.valid) {
      const val = this.productForm.value;
      const productData = {
        name: val.name!,
        price: val.price!,
        stock: val.stock!,
        image: val.image || undefined
      };

      if (this.isEditMode && this.editingProductId) {
        this.posService.editProduct(this.editingProductId, productData);
      } else {
        this.posService.addProduct(productData);
      }

      this.displayDialog = false;
    }
  }

  deleteProduct(id: string) {
    this.posService.deleteProduct(id);
  }
}
