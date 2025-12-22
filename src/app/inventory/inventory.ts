import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosService } from '../pos-terminal/services/pos.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, InputTextModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class InventoryComponent {
  posService = inject(PosService);
}
