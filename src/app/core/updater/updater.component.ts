import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@tauri-apps/plugin-updater';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBar } from "@angular/material/progress-bar";
import { relaunch } from '@tauri-apps/plugin-process';

@Component({
    selector: 'sia-updater',
    imports: [MatDialogModule, MatButtonModule, DatePipe, DecimalPipe, MatProgressSpinnerModule, MatProgressBar],
    templateUrl: './updater.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdaterComponent {

    readonly dialogRef = inject(MatDialogRef<UpdaterComponent>);
    readonly update = inject<Update>(MAT_DIALOG_DATA);
    readonly loading = model<boolean | undefined>(false)

    private readonly _downloaded = signal(0);
    private readonly _contentLength = signal(0);
    readonly downloaded = computed(() => this._downloaded() / (1024 * 1024));
    readonly contentLength = computed(() => this._contentLength() / (1024 * 1024));
    readonly loadingPercentage = computed(() => this.contentLength() === 0 ? 0 : this._downloaded() * 100 / this._contentLength())

    /**
     * Closes the dialog
     */
    onNoClick(): void {
        this.dialogRef.close();
    }

    /**
     * Download target update and installs it
     *
     * Then proceeds to relaunch the app
     */
    async downloadAndInstall(): Promise<void> {
        try {
            await this.update.downloadAndInstall((message) => {
                console.log(message)
                switch (message.event) {
                    case 'Started':
                        this.loading.set(true);
                        this._contentLength.set(message.data.contentLength);
                        break;
                    case 'Progress':
                        this._downloaded.set(this._downloaded() + message.data.chunkLength);
                        break;
                    case 'Finished':
                        this.loading.set(false);
                        break;
                }
            });
            await relaunch();
        }
        catch (error) {
            this.loading.set(false);
            console.error(error);
        }
    }
}
