import { ChangeDetectionStrategy, Component, computed, effect, inject, input, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { ClientService } from 'app/core/client/client.service';
import { Client } from 'app/core/client/client.types';
import { CreateShipmentItemDto, UpdateShipmentDto, UpdateShipmentInfoDto, UpdateShipmentItemDto } from 'app/core/shipment/shipment.dto';
import { startWith, distinctUntilChanged, debounceTime, filter, switchMap, map, combineLatest } from 'rxjs';
import { ShipmentInfoFormComponent } from '../../components/shipment-info-form/shipment-info-form.component';
import { ShipmentService } from 'app/core/shipment/shipment.service';
import { Shipment } from 'app/core/shipment/shipment.types';
import { diffDeep } from 'app/shared/utils/diff-deep';
import { hasOnlyKeysDeep } from 'app/shared/utils/has-only-keys-deep';

@Component({
    selector: 'sia-shipment-edition-page',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatAutocompleteModule, MatIconModule, MatInputModule, MatButtonModule, FuseAlertComponent, ShipmentInfoFormComponent, RouterLink],
    templateUrl: './shipment-edition-page.component.html',
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShipmentEditionPageComponent {

    private readonly _shipmentService = inject(ShipmentService);
    private readonly _clientService = inject(ClientService);
    private readonly _formBuilder = inject(NonNullableFormBuilder);
    private readonly _router = inject(Router);

    readonly shipmentId = input.required<string>();
    private readonly _shipmentId = computed(() => +this.shipmentId());
    private readonly _shipmentResource = this._shipmentService.getResource(this._shipmentId);
    readonly shipment = computed(() => this._shipmentResource.value());

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

    readonly shipmentInfoControl = this._formBuilder.control<UpdateShipmentInfoDto | null>(null, Validators.required);

    readonly shippingItemsControl = this._formBuilder.array([
        this._formBuilder.group({
            id: this._formBuilder.control<number>(null, Validators.required),
            designation: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]]
        })
    ], Validators.minLength(1));

    private readonly _initialFormValue = computed(() => this._getFormValue(this.shipment()));
    private readonly _watchChanges = toSignal(
        combineLatest({
            shipment: this.shipmentInfoControl.valueChanges,
            from: this.senderControl.valueChanges.pipe(map(({ id }) => id)),
            to: this.recipientControl.valueChanges.pipe(map(({ id }) => id)),
            items: this.shippingItemsControl.valueChanges
        })
    );
    private readonly _formChanges = computed(() => diffDeep(this._initialFormValue(), this._watchChanges(), ['id']));
    readonly formUnchanged = computed(() => {
        return hasOnlyKeysDeep(this._formChanges(), ['id', 'shipment', 'items', 'from', 'to']) &&
            // Items count should match
            this._formChanges().items.length === untracked(this.shipment).items?.length;
    });

    readonly alert: WritableSignal<{ type: FuseAlertType; message: string }> = signal({
        type: 'success',
        message: '',
    });

    readonly showAlert = signal(false);

    /**
     * Constructor
     */
    constructor() {
        // Initializes form value with shipment info
        // Initializes sender and recipient
        // Initializes shipping items
        effect(() => this._initFormValue(this._initialFormValue()));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add a shipping item to the items FormArray
     *
     * @param {ShipmentItem} item
     */
    addShippingItem(item?: Partial<CreateShipmentItemDto> | UpdateShipmentItemDto): void {
        this.shippingItemsControl.push(
            this._formBuilder.group({
                id: this._formBuilder.control<number | null>({ value: (item as UpdateShipmentItemDto)?.id ?? null, disabled: (item as UpdateShipmentItemDto)?.id === undefined }),
                designation: [item?.designation ?? '', Validators.required],
                quantity: [item?.quantity ?? 1, [Validators.required, Validators.min(1)]]
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
     * Update shipment
     *
     * @param stayOnPage
     */
    updateShipment(stayOnPage: boolean = false): void {

        if (this.shipmentInfoControl.invalid || this.shippingItemsControl.invalid || this.recipientControl.invalid || this.senderControl.invalid) { return; }

        this.shipmentInfoControl.disable();
        this.senderControl.disable();
        this.recipientControl.disable();
        this.shippingItemsControl.disable();

        const payload: Readonly<UpdateShipmentDto> = Object.freeze<UpdateShipmentDto>(this._formChanges());

        this._shipmentService.update(payload)
            .subscribe({
                next: (updatedShipment) => {
                    if (!stayOnPage) {
                        return this._router.navigate(['/shipments']);
                    }

                    // Refresh internal shipment state
                    // This also triggers form reset via an effect
                    this._shipmentResource.set(updatedShipment);

                    this.shipmentInfoControl.enable();
                    this.senderControl.enable();
                    this.recipientControl.enable();
                    this.shippingItemsControl.enable();

                    this.alert.set({
                        type: 'success',
                        message: 'Mise à jour réussie'
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

    /**
     * Get form value from shipment
     *
     * @param shipment
     * @returns
     */
    private _getFormValue(shipment: Shipment): UpdateShipmentDto {
        if (!shipment) { return null; }
        const { id, pickupDate, pickupTime, deliveryCountryCode, deliveryCityCode, deliveryAddress, bundledLength, bundledWidth, bundledHeight, totalWeight, totalPrice } = shipment;
        const { from, to } = shipment;
        const { items } = shipment;
        return {
            shipment: { id, pickupDate, pickupTime, deliveryCountryCode, deliveryCityCode, deliveryAddress, bundledLength, bundledWidth, bundledHeight, totalWeight, totalPrice },
            from: from.id,
            to: to.id,
            items: items.map(({ id, designation, quantity }) => ({ id, designation, quantity }))
        };
    }

    /**
     * Init form value from dto
     *
     * @param value
     */
    private _initFormValue(value: UpdateShipmentDto): void {
        if (!value) { return; }
        const { shipment, items } = value;
        this.shipmentInfoControl.patchValue(shipment);
        this.senderControl.setValue(this.shipment().from);
        this.recipientControl.setValue(this.shipment().to);
        // Empty items array
        this.shippingItemsControl.clear();
        items.forEach(item => this.addShippingItem(item));
    }
}
