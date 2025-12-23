import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pos',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login.component/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'pos',
    loadComponent: () => import('./pos-terminal/pos-terminal').then(m => m.PosTerminalComponent),
    canActivate: [authGuard]
  },
  {
    path: 'inventory',
    loadComponent: () => import('./inventory/inventory').then(m => m.InventoryComponent),
    canActivate: [authGuard]
  }
];
