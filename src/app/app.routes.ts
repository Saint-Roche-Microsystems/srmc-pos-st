import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'pos',
        pathMatch: 'full'
    },
    {
        path: 'pos',
        loadComponent: () => import('./pos-terminal/pos-terminal').then(m => m.PosTerminalComponent)
    },
    {
        path: 'inventory',
        loadComponent: () => import('./inventory/inventory').then(m => m.InventoryComponent)
    }
];
