import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./sign-up.component'),
    },
] as Routes;
