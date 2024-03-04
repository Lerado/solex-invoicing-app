import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { appWindow } from '@tauri-apps/api/window';

@Component({
    selector: 'sia-window-commands',
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: './window-commands.component.html',
    styles: ':host { display: block; }',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WindowCommandsComponent {

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle maximize window
     */
    toggleMaximizeWindow(): void {
        appWindow.toggleMaximize();
    }

    /**
     * Hide window
     */
    minimizeWindow(): void {
        appWindow.minimize();
    }

    /**
     * Close window
     */
    closeWindow(): void {
        appWindow.close();
    }
}
