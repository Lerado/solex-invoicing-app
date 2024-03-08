import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { ShipmentCreationStepperComponent } from '../../components/shipment-creation-stepper/shipment-creation-stepper.component';
import { CountryService } from 'app/core/country/country.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CityService } from 'app/core/city/city.service';
import { CreateShipmentDto } from 'app/core/shipment/shipment.dto';
import { ShipmentService } from 'app/core/shipment/shipment.service';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable, switchMap, tap } from 'rxjs';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'sia-shipment-creation-page',
    standalone: true,
    imports: [ShipmentCreationStepperComponent, FuseAlertComponent],
    templateUrl: './shipment-creation-page.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipmentCreationPageComponent {

    countries = toSignal(this._countryService.countries$, { initialValue: [] });
    cities = toSignal(this._cityService.cities$, { initialValue: [] });

    formDisabled = signal<boolean>(false);

    alert: WritableSignal<{ type: FuseAlertType; message: string }> = signal({
        type: 'success',
        message: '',
    });

    showAlert = signal(false);

    /**
     * Constructor
     */
    constructor(
        private readonly _shipmentService: ShipmentService,
        private readonly _countryService: CountryService,
        private readonly _cityService: CityService,
        private readonly _fuseConfirmationService: FuseConfirmationService,
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
            .pipe(
                switchMap(() => this._resolveNavigateAfterSuccess(payload))
            )
            .subscribe({
                error: (message) => {
                    this.formDisabled.set(false);

                    // Set the alert
                    this.alert.set({
                        type: 'error',
                        message
                    });

                    // Show the alert
                    this.showAlert.set(true);
                },
                complete: () => this.formDisabled.set(false)
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Where to navigate after a shipment was successfully created
     */
    private _resolveNavigateAfterSuccess(payload: CreateShipmentDto): Observable<string> {
        const confirmationDialog = this._fuseConfirmationService.open({
            message: 'Souhaitez-vous ajouter des colis à cette expédition ?',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-circle',
                color: 'primary',
            },
            actions: {
                confirm: {
                    label: 'Oui',
                    color: 'primary',
                },
                cancel: {
                    label: 'Non',
                },
            }
        });
        return confirmationDialog.afterClosed()
            .pipe(
                tap((result) => {
                    if (result === 'confirmed') {
                        this._router.navigate(['/packages', 'create'], { queryParams: { shipmentNumber: payload.number } });
                        return;
                    }
                    this._router.navigate(['/shipments']);
                })
            );
    }
}
