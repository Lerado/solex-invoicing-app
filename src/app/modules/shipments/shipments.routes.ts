import { Routes } from '@angular/router';
import { ShipmentsListPageComponent } from './pages/shipments-list-page/shipments-list-page.component';

export default [
    {
        path: '',
        pathMatch: 'full',
        title: 'Expéditions', // cspell:disable-line
        component: ShipmentsListPageComponent
    }
] as Routes;
