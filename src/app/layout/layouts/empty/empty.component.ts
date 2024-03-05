
import { Component, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { platform } from '@tauri-apps/api/os';
import { WindowCommandsComponent } from 'app/layout/common/window-commands/window-commands.component';
import { from } from 'rxjs';

@Component({
    selector: 'empty-layout',
    templateUrl: './empty.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FuseLoadingBarComponent, WindowCommandsComponent, RouterOutlet],
})
export class EmptyLayoutComponent {

    platform = toSignal(
        from(
            platform()
                .catch(() => 'browser')
        )
    );
}
