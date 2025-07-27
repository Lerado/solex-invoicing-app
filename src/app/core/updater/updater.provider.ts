import { Provider, EnvironmentProviders, provideEnvironmentInitializer, importProvidersFrom, inject } from '@angular/core';
import { check } from '@tauri-apps/plugin-updater';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpdaterComponent } from './updater.component';

export const provideAppUpdater = (): Array<Provider | EnvironmentProviders> => [
    importProvidersFrom(MatDialogModule),
    provideEnvironmentInitializer(async () => {
        const dialog = inject(MatDialog);
        const update = await check();
        if (update) {
            const dialogRef = dialog.open(UpdaterComponent, { data: update, disableClose: true, minWidth: '30vw', maxWidth: '50vw' });
            dialogRef.afterClosed().subscribe();
        }
    })
];
