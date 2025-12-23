import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosService } from './services/pos.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-pos-terminal',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule, InputNumberModule],
  templateUrl: './pos-terminal.html',
  styleUrl: './pos-terminal.css'
})
export class PosTerminalComponent {
  posService = inject(PosService);

  // Método para obtener la severidad del tag de stock
  getStockSeverity(stock: number): 'success' | 'warn' | 'danger' {
    if (stock === 0) return 'danger';
    if (stock <= 5) return 'warn';
    return 'success';
  }

  // Método para obtener el texto del tag de stock
  getStockText(stock: number): string {
    if (stock === 0) return 'Agotado';
    if (stock <= 5) return `Stock bajo (${stock})`;
    return `Stock: ${stock}`;
  }
}
