import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, computed, input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShipmentService } from 'app/core/shipment/shipment.service';
import { ShippingSlipComponent } from '../../components/shipping-slip/shipping-slip.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ShippingReceiptComponent } from '../../components/shipping-receipt/shipping-receipt.component';

enum ShipmentPrintableType {
    Slip = 'slip',
    Receipt = 'receipt'
}

@Component({
    selector: 'sia-shipment-printing-page',
    imports: [MatButtonModule, MatIconModule, CdkScrollableModule, ShippingSlipComponent, MatButtonToggleModule, ShippingReceiptComponent],
    templateUrl: './shipment-printing-page.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ShipmentPrintingPageComponent {

    private readonly _shipmentService = inject(ShipmentService);

    readonly shipmentNumber = input.required<string>();

    private readonly _shipmentResource = this._shipmentService.getByNumberResource(this.shipmentNumber);
    readonly shipment = computed(() => this._shipmentResource.value());

    readonly printableTypes = ShipmentPrintableType;
    readonly printableType: ShipmentPrintableType = ShipmentPrintableType.Slip;

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prints the page
     */
    print(): void {
        window.print();
    }
}
