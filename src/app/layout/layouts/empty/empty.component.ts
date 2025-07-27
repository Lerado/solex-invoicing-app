
import { Component, signal, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { platform } from '@tauri-apps/plugin-os';

@Component({
    selector: 'sia-empty-layout',
    templateUrl: './empty.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [FuseLoadingBarComponent, RouterOutlet]
})
export class EmptyLayoutComponent {
    platform = signal(platform() || 'browser').asReadonly();
}
