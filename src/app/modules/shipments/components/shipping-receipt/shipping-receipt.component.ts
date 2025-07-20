import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Shipment } from 'app/core/shipment/shipment.types';
import { UserService } from 'app/core/user/user.service';
import { BarcodeDirective } from 'app/shared/directives/barcode.directive';

@Component({
    selector: 'sia-shipping-receipt',
    imports: [DatePipe, CurrencyPipe, DecimalPipe, BarcodeDirective],
    templateUrl: './shipping-receipt.component.html',
    host: {
        class: 'contents'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingReceiptComponent {

    readonly shipment = input.required<Shipment>();

    private readonly _userService = inject(UserService);
    readonly user = toSignal(this._userService.user$, { requireSync: true });
    readonly cashierName = computed(() => this.user().cashierName);

    readonly dimensions = computed(() => {
        const s = this.shipment();
        return `${s.bundledLength}x${s.bundledWidth}x${s.bundledHeight}m`;
    });

    readonly currentDateTime = computed(() => {
        return new Date().toLocaleString('fr-FR');
    });
}
