import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const appRoutes: Routes = [

    // Redirect empty path to '/shipments'
    { path: '', pathMatch: 'full', redirectTo: 'shipments' },

    // Redirect signed-in user to the '/shipments'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'shipments' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
        ]
    },

    // App routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        children: [
            { path: 'shipments', loadChildren: () => import('app/modules/shipments/shipments.routes') },
            { path: 'packages', loadChildren: () => import('app/modules/shipment-packages/shipment-packages.routes') },
        ]
    }
];
