import { ChangeDetectionStrategy, Component, inject, Signal, signal, TemplateRef, viewChild, WritableSignal } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientInfoFormComponent } from "app/modules/clients/components/client-info-form/client-info-form.component";
import { CreateClientDto } from 'app/core/client/client.dto';

@Component({
    selector: 'sia-shipment-creation-page',
    imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatAutocompleteModule, MatIconModule, MatInputModule, FuseAlertComponent, ShipmentInfoFormComponent, RouterLink, MatButtonModule, ClientInfoFormComponent],
    templateUrl: './shipment-creation-page.component.html',
    styles: ':host { display: block;}',
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShipmentCreationPageComponent {

    private readonly _shipmentService = inject(ShipmentService);
    private readonly _clientService = inject(ClientService);
    private readonly _formBuilder = inject(NonNullableFormBuilder);
    private readonly _dialog = inject(MatDialog);
    private readonly _router = inject(Router);

    private readonly _addClientDialog = viewChild<TemplateRef<any>>('createClientDialog');
    readonly clientForm = this._formBuilder.control<CreateClientDto | null>(null, Validators.required);
    readonly clientFormChanges = toSignal(this.clientForm.valueChanges);

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

        this._disableControls();

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
                    this._resetControls();

                    this._enableControls();

                    this.alert.set({
                        type: 'success',
                        message: 'Expédition créée avec succès'
                    });
                    // Show the alert
                    this.showAlert.set(true);
                },
                error: (message) => {

                    this._enableControls();

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

    /**
     * Open dialog to add a new client
     */
    openCreateClientDialog(): void {
        const dialogRef = this._dialog.open(this._addClientDialog(), { minWidth: '40vw' });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const payload: Readonly<CreateClientDto> = Object.freeze(result as CreateClientDto);
                this._clientService.create(payload)
                    .subscribe({
                        next: () => {
                            this.clientForm.reset();
                            this.alert.set({
                                type: 'success',
                                message: 'Client ajouté avec succès'
                            });
                            // Show the alert
                            this.showAlert.set(true);
                        },
                        error: (message) => {
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
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Disable all controls
     */
    private _disableControls(): void {
        this._setDisabledState(true);
    }

    /**
     * Enable all controls
     */
    private _enableControls(): void {
        this._setDisabledState(false);
    }

    /**
     * Reset all controls
     */
    private _resetControls(): void {
        this.shipmentInfoControl.reset();
        this.senderControl.reset();
        this.recipientControl.reset();
        this.shippingItemsControl.reset();
    }

    /**
     * Enable/disable all controls
     */
    private _setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.shipmentInfoControl.disable();
            this.senderControl.disable();
            this.recipientControl.disable();
            this.shippingItemsControl.disable();
        }
        else {
            this.shipmentInfoControl.enable();
            this.senderControl.enable();
            this.recipientControl.enable();
            this.shippingItemsControl.enable();
        }
    }
}
