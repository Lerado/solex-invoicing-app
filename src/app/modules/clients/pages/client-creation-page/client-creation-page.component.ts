import { ChangeDetectionStrategy, Component, inject, signal, viewChild, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { CreateClientDto } from 'app/core/client/client.dto';
import { ClientInfoFormComponent } from '../../components/client-info-form/client-info-form.component';
import { ClientService } from 'app/core/client/client.service';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'sia-client-creation-page',
    imports: [ClientInfoFormComponent, ReactiveFormsModule, RouterLink, MatButton, FuseAlertComponent],
    animations: fuseAnimations,
    templateUrl: './client-creation-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ClientCreationPageComponent {

    private readonly _clientService = inject(ClientService);
    private readonly _router = inject(Router);

    clientFormEl = viewChild.required(ClientInfoFormComponent);
    clientForm = new FormControl<CreateClientDto | null>(null, Validators.required);

    alert: WritableSignal<{ type: FuseAlertType; message: string }> = signal({
        type: 'success',
        message: '',
    });

    showAlert = signal(false);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create client and store it on the backend
     *
     * @param stayOnPage
     */
    createClient(stayOnPage: boolean = false): void {

        if (this.clientForm.invalid) { return; }

        this.clientForm.disable();

        this._clientService.create(this.clientForm.getRawValue() as CreateClientDto)
            .subscribe({
                next: () => {
                    if (!stayOnPage) {
                        return this._router.navigate(['/clients']);
                    }
                    // Reset client form
                    this.clientFormEl().reset();
                    this.clientForm.reset();

                    this.clientForm.enable();

                    this.alert.set({
                        type: 'success',
                        message: 'Client ajouté avec succès'
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
