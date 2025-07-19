import { Routes } from '@angular/router';

export default [
    {
        path: '',
        pathMatch: 'full',
        title: 'Colis',
        loadComponent: () => import('./pages/shipment-packages-list-page/shipment-packages-list-page.component')
    },
    {
        path: 'create',
        title: 'Ajouter un colis',
        loadComponent: () => import('./pages/shipment-package-creation-page/shipment-package-creation-page.component')
    }
] as Routes;
