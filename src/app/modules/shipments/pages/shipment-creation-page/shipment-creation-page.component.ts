import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ShipmentCreationStepperComponent } from '../../components/shipment-creation-stepper/shipment-creation-stepper.component';
import { CountryService } from 'app/core/country/country.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CityService } from 'app/core/city/city.service';
import { CreateShipmentDto } from 'app/core/shipment/shipment.dto';
import { ShipmentService } from 'app/core/shipment/shipment.service';
import { Router } from '@angular/router';

@Component({
    selector: 'sia-shipment-creation-page',
    standalone: true,
    imports: [ShipmentCreationStepperComponent],
    templateUrl: './shipment-creation-page.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipmentCreationPageComponent {

    countries = toSignal(this._countryService.countries$, { initialValue: [] });
    cities = toSignal(this._cityService.cities$, { initialValue: [] });

    formDisabled = signal<boolean>(false);

    /**
     * Constructor
     */
    constructor(
        private readonly _shipmentService: ShipmentService,
        private readonly _countryService: CountryService,
        private readonly _cityService: CityService,
        private readonly _router: Router
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create shipment and store it on the backend
     *
     * @param payload
     */
    createShipment(payload: CreateShipmentDto): void {

        this.formDisabled.set(true);

        this._shipmentService.create(payload)
            .subscribe({
                next: () => this._router.navigate(['/shipments']),
                complete: () => this.formDisabled.set(false)
            });
    }
}
