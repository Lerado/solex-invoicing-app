import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Shipment } from 'app/core/shipment/shipment.types';
import { UserService } from 'app/core/user/user.service';
import { BarcodeDirective } from 'app/shared/directives/barcode.directive';
import { PaperSize } from './shipping-receipt.types';

@Component({
    selector: 'sia-shipping-receipt',
    imports: [DatePipe, CurrencyPipe, DecimalPipe, BarcodeDirective],
    templateUrl: './shipping-receipt.component.html',
    styleUrl: './shipping-receipt.component.scss',
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'contents'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingReceiptComponent {

    readonly shipment = input.required<Shipment>();
    paperSize = input<PaperSize>(PaperSize.MM_80);

    printWidthClass = computed(() => {
        switch (this.paperSize()) {
            case '58mm':
                return 'w-[220px] print:w-[50mm]';
            case '57mm':
                return 'w-[216px] print:w-[50mm]';
            default: // 80mm
                return 'w-[280px] print:w-[72mm]';
        }
    });

    private readonly _userService = inject(UserService);
    readonly cashier = toSignal(this._userService.user$, { requireSync: true });

    readonly currentDateTime = computed(() => {
        return new Date().toLocaleString('fr-FR');
    });
}
