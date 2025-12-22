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
}
