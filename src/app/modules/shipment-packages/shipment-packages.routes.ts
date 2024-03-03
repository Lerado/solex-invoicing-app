import { Routes } from '@angular/router';
import { ShipmentPackagesListPageComponent } from './pages/shipment-packages-list-page/shipment-packages-list-page.component';
import { ShipmentPackageCreationPageComponent } from './pages/shipment-package-creation-page/shipment-package-creation-page.component';

export default [
    {
        path: '',
        pathMatch: 'full',
        title: 'Colis', // cspell:disable-line
        component: ShipmentPackagesListPageComponent
    },
] as Routes;
