import { Routes } from '@angular/router';

export default [
    {
        path: '',
        pathMatch: 'full',
        title: 'Clients',
        loadComponent: () => import('./pages/clients-list-page/clients-list-page.component')
    },
    {
        path: 'create',
        title: 'Ajouter un client',
        loadComponent: () => import('./pages/client-creation-page/client-creation-page.component')
    },
] as Routes;
