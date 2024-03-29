import { Routes } from '@angular/router';
import { ShipmentsListPageComponent } from './pages/shipments-list-page/shipments-list-page.component';
import { ShipmentCreationPageComponent } from './pages/shipment-creation-page/shipment-creation-page.component';
import { ShipmentPrintingPageComponent } from './pages/shipment-printing-page/shipment-printing-page.component';

export default [
    {
        path: '',
        pathMatch: 'full',
        title: 'Expéditions', // cspell:disable-line
        component: ShipmentsListPageComponent
    },
    {
        path: 'create',
        title: 'Ajouter une expédition', // cspell:disable-line
        component: ShipmentCreationPageComponent
    },
    {
        path: ':shipmentId/print',
        title: 'Imprimer le bordereau',
        component: ShipmentPrintingPageComponent
    }
] as Routes;
