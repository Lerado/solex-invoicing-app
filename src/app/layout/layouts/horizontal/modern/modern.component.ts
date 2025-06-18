import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, ViewEncapsulation, computed, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseHorizontalNavigationComponent, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { platform } from '@tauri-apps/plugin-os';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { WindowCommandsComponent } from 'app/layout/common/window-commands/window-commands.component';

@Component({
    selector: 'modern-layout',
    templateUrl: './modern.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [NgClass, FuseLoadingBarComponent, FuseVerticalNavigationComponent, FuseHorizontalNavigationComponent, MatButtonModule, MatIconModule, UserComponent, LanguagesComponent, WindowCommandsComponent, RouterOutlet, NgOptimizedImage]
})
export class ModernLayoutComponent {
    private readonly _navigationService = inject(NavigationService);
    private readonly _fuseMediaWatcherService = inject(FuseMediaWatcherService);
    private readonly _fuseNavigationService = inject(FuseNavigationService);


    mediaChanges = toSignal(this._fuseMediaWatcherService.onMediaChange$);
    navigation = toSignal(this._navigationService.navigation$);
    currentYear = new Date().getFullYear();

    isScreenSmall = computed(() => !this.mediaChanges().matchingAliases.includes('md'));

    platform = signal(platform() || 'browser').asReadonly();

    /** Inserted by Angular inject() migration for backwards compatibility */
    constructor(...args: unknown[]);

    /**
     * Constructor
     */
    constructor() { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
