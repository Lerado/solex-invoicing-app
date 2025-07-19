import { Routes } from '@angular/router';

export default [
    {
        path: '',
        pathMatch: 'full',
        title: 'Expéditions',
        loadComponent: () => import('./pages/shipments-list-page/shipments-list-page.component')
    },
    {
        path: 'create',
        title: 'Ajouter une expédition',
        loadComponent: () => import('./pages/shipment-creation-page/shipment-creation-page.component')
    },
    {
        path: ':shipmentNumber/print',
        title: 'Imprimer le bordereau',
        loadComponent: () => import('./pages/shipment-printing-page/shipment-printing-page.component')
    }
] as Routes;
