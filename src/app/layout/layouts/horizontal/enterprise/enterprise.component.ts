import { Component, ViewEncapsulation, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseHorizontalNavigationComponent, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';

@Component({
    selector: 'enterprise-layout',
    templateUrl: './enterprise.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FuseLoadingBarComponent, FuseVerticalNavigationComponent, MatButtonModule, MatIconModule, LanguagesComponent, FuseFullscreenComponent, FuseHorizontalNavigationComponent, RouterOutlet],
})
export class EnterpriseLayoutComponent {

    mediaChanges = toSignal(this._fuseMediaWatcherService.onMediaChange$);
    navigation = toSignal(this._navigationService.navigation$);
    currentYear = new Date().getFullYear();

    isScreenSmall = computed(() => !this.mediaChanges().matchingAliases.includes('md'));

    /**
     * Constructor
     */
    constructor(
        private readonly _navigationService: NavigationService,
        private readonly _fuseMediaWatcherService: FuseMediaWatcherService,
        private readonly _fuseNavigationService: FuseNavigationService,
    ) {
    }

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
