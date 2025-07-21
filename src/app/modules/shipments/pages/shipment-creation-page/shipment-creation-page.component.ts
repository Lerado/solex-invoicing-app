import { ChangeDetectionStrategy, Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { ShipmentService } from 'app/core/shipment/shipment.service';
import { ShipmentInfoFormComponent } from '../../components/shipment-info-form/shipment-info-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { Client } from 'app/core/client/client.types';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, distinctUntilChanged, debounceTime, filter, switchMap, map } from 'rxjs';
import { ClientService } from 'app/core/client/client.service';
import { MatInputModule } from '@angular/material/input';
import { CreateShipmentDto, CreateShipmentInfoDto } from 'app/core/shipment/shipment.dto';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'sia-shipment-creation-page',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatAutocompleteModule, MatIconModule, MatInputModule, FuseAlertComponent, ShipmentInfoFormComponent, RouterLink, MatButtonModule],
    templateUrl: './shipment-creation-page.component.html',
    styles: ':host { display: block;}',
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShipmentCreationPageComponent {

    private readonly _shipmentService = inject(ShipmentService);
    private readonly _clientService = inject(ClientService);
    private readonly _formBuilder = inject(NonNullableFormBuilder);
    private readonly _router = inject(Router);

    readonly nextShipmentReference = toSignal(this._shipmentService.getNextReference());

    readonly senderSearchControl = this._formBuilder.control<string>('', Validators.required);
    readonly senderControl = this._formBuilder.control<Client>(null, Validators.required);
    readonly filteredSenders: Signal<Client[]> = toSignal(this.senderSearchControl.valueChanges.pipe(
        startWith(''),
        distinctUntilChanged(),
        debounceTime(300),
        filter(value => value.length >= 2),
        switchMap((search: string) => this._clientService.getAll({ paginate: false }, {}, search)),
        map(({ items }) => items)
    ), { initialValue: [] });

    readonly recipientSearchControl = this._formBuilder.control<string>('', Validators.required);
    readonly recipientControl = this._formBuilder.control<Client>(null, Validators.required);
    readonly filteredRecipients: Signal<Client[]> = toSignal(this.recipientSearchControl.valueChanges.pipe(
        startWith(''),
        distinctUntilChanged(),
        debounceTime(300),
        filter(value => value.length >= 2),
        switchMap((search: string) => this._clientService.getAll({ paginate: false }, {}, search)),
        map(({ items }) => items)
    ), { initialValue: [] });

    readonly shipmentInfoControl = this._formBuilder.control<CreateShipmentInfoDto>(null, Validators.required);

    readonly shippingItemsControl = this._formBuilder.array([
        this._formBuilder.group({
            designation: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]]
        })
    ], Validators.minLength(1));

    readonly alert: WritableSignal<{ type: FuseAlertType; message: string }> = signal({
        type: 'success',
        message: '',
    });

    readonly showAlert = signal(false);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add a shipping item to the items FormArray
     */
    addShippingItem(): void {
        this.shippingItemsControl.push(
            this._formBuilder.group({
                designation: ['', Validators.required],
                quantity: [1, [Validators.required, Validators.min(1)]]
            })
        );
    }

    /**
     * Remove a shipping item at a given index from the items FormArray
     *
     * @param index
     */
    removeShippingItem(index: number): void {
        if (this.shippingItemsControl.length > 1) {
            this.shippingItemsControl.removeAt(index);
        }
    }

    /**
     * Create shipment and store it on the backend
     *
     * @param stayOnPage
     */
    createShipment(stayOnPage: boolean = false): void {

        if (this.shipmentInfoControl.invalid || this.shippingItemsControl.invalid || this.recipientControl.invalid || this.senderControl.invalid) { return; }

        this.shipmentInfoControl.disable();
        this.senderControl.disable();
        this.recipientControl.disable();
        this.shippingItemsControl.disable();

        const payload: Readonly<CreateShipmentDto> = Object.freeze<CreateShipmentDto>({
            shipment: this.shipmentInfoControl.getRawValue(),
            from: this.senderControl.getRawValue().id,
            to: this.recipientControl.getRawValue().id,
            items: this.shippingItemsControl.getRawValue()
        });

        this._shipmentService.create(payload)
            .subscribe({
                next: () => {
                    if (!stayOnPage) {
                        return this._router.navigate(['/shipments']);
                    }
                    // Reset every form
                    this.shipmentInfoControl.reset();
                    this.senderControl.reset();
                    this.recipientControl.reset();
                    this.shippingItemsControl.reset();

                    this.shipmentInfoControl.enable();
                    this.senderControl.enable();
                    this.recipientControl.enable();
                    this.shippingItemsControl.enable();

                    this.alert.set({
                        type: 'success',
                        message: 'Expédition créée avec succès'
                    });
                    // Show the alert
                    this.showAlert.set(true);
                },
                error: (message) => {

                    this.shipmentInfoControl.enable();
                    this.senderControl.enable();
                    this.recipientControl.enable();
                    this.shippingItemsControl.enable();

                    // Set the alert
                    this.alert.set({
                        type: 'error',
                        message
                    });

                    // Show the alert
                    this.showAlert.set(true);
                }
            });
    }

    /**
     * Display client name in autocomplete
     *
     * @param value
     */
    displayClient(value: Client): string {
        if (!value) {
            return '';
        }
        return `${value.firstName} ${value.lastName} - ${value.contact}`;
    }
}
