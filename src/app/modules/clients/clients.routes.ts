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
    {
        path: 'edit/:clientId',
        title: 'Modifier les informations du client',
        loadComponent: () => import('./pages/client-edition-page/client-edition-page.component')
    }
] as Routes;
