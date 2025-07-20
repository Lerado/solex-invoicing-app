import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

@Component({
    selector: 'sia-window-commands',
    imports: [MatButtonModule],
    templateUrl: './window-commands.component.html',
    styles: ':host { display: block; }',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowCommandsComponent {

    readonly APP_WINDOW = getCurrentWebviewWindow();

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle maximize window
     */
    toggleMaximizeWindow(): void {
        this.APP_WINDOW.toggleMaximize();
    }

    /**
     * Hide window
     */
    minimizeWindow(): void {
        this.APP_WINDOW.minimize();
    }

    /**
     * Close window
     */
    closeWindow(): void {
        this.APP_WINDOW.close();
    }
}
