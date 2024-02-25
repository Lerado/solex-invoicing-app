import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Routes = [

    // Redirect empty path to '/shipments'
    { path: '', pathMatch: 'full', redirectTo: 'shipments' },

    // App routes
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'shipments', loadChildren: () => import('app/modules/shipments/shipments.routes') },
        ]
    }
];
