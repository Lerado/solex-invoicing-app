import { CurrencyPipe, DatePipe, DecimalPipe, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Shipment } from 'app/core/shipment/shipment.types';
import { UserService } from 'app/core/user/user.service';
import { FrenchNumberPipe } from 'app/shared/pipes/french-number.pipe';
import { PhoneNumberPipe } from 'app/shared/pipes/phone-number.pipe';

@Component({
    selector: 'sia-shipping-slip',
    imports: [NgOptimizedImage, PhoneNumberPipe, DecimalPipe, TitleCasePipe, FrenchNumberPipe, CurrencyPipe, DatePipe],
    templateUrl: './shipping-slip.component.html',
    host: {
        class: 'contents'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingSlipComponent {

    private readonly _userService = inject(UserService);
    readonly user = toSignal(this._userService.user$, { requireSync: true });

    readonly shipment = input.required<Shipment>();

    shipmentPackagesCount = computed(() => this.shipment().items.reduce(
        (subTotal, current) => subTotal + current.quantity,
        0
    ));
    shipmentPackagesEmptySeats = computed(() => new Array(this.shipment().items.length > 5 ? 0 : 5 - this.shipment().items.length));
}
