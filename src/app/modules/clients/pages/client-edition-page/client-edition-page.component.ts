import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType, FuseAlertComponent } from '@fuse/components/alert';
import { UpdateClientDto } from 'app/core/client/client.dto';
import { ClientService } from 'app/core/client/client.service';
import { ClientInfoFormComponent } from '../../components/client-info-form/client-info-form.component';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { deepDiff } from 'app/shared/utils/deep-diff';

@Component({
    selector: 'sia-client-edition-page',
    imports: [ReactiveFormsModule, MatButtonModule, RouterLink, FuseAlertComponent, ClientInfoFormComponent],
    templateUrl: './client-edition-page.component.html',
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ClientEditionPageComponent {

    private readonly _clientService = inject(ClientService);
    private readonly _router = inject(Router);

    readonly clientId = input.required<string>();
    private readonly _clientId = computed(() => +this.clientId());
    private readonly _clientResource = this._clientService.getResource(this._clientId);
    readonly client = computed(() => this._clientResource.value());

    readonly clientForm = new FormControl<UpdateClientDto>({}, Validators.required);
    private readonly _clientFormChanges = toSignal(this.clientForm.valueChanges);
    private readonly _formChanges = computed(() => deepDiff(this.client(), this._clientFormChanges()));
    readonly formUnchanged = computed(() => Object.keys(this._formChanges()).length === 0);

    readonly alert: WritableSignal<{ type: FuseAlertType; message: string }> = signal({
        type: 'success',
        message: '',
    });

    readonly showAlert = signal(false);

    /**
     * Constructor
     */
    constructor() {
        // Initializes form value with client info
        effect(() => {
            if (!this.client()) { return; }
            const { firstName, lastName, contact, address } = this.client();
            this.clientForm.patchValue({ firstName, lastName, contact, address });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update client's information
     *
     * @param {boolean} stayOnPage Defaults to `false`
     * @returns
     */
    updateClient(stayOnPage: boolean = false): void {

        if (this.clientForm.invalid) { return; }

        this.clientForm.disable();

        const payload: Readonly<UpdateClientDto> = Object.freeze<UpdateClientDto>(this._formChanges());

        this._clientService.update(this._clientId(), payload)
            .subscribe({
                next: (updatedClient) => {
                    if (!stayOnPage) {
                        return this._router.navigate(['/clients']);
                    }

                    const { firstName, lastName, contact, address } = updatedClient;
                    // Reset client form to new values
                    this.clientForm.reset({ firstName, lastName, contact, address });

                    this.clientForm.enable();

                    this.alert.set({
                        type: 'success',
                        message: 'Mise à jour réussie'
                    });
                    // Show the alert
                    this.showAlert.set(true);
                },
                error: (message) => {
                    this.clientForm.enable();

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
}
