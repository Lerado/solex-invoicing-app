import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { delay, filter, take } from 'rxjs';
import { TauriService } from '../tauri/tauri.service';

@Injectable({ providedIn: 'root' })
export class ExtendedSplashScreenService extends FuseSplashScreenService {

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) _document: Document,
        _router: Router,
        private readonly _tauriService: TauriService
    ) {
        super(_document, _router);

        // Extend web app splashscreen with Desktop splashscreen
        // We just need to hide the splashscreen window when navigation is ready

        // Hide it on the first NavigationEnd event
        _router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                take(1),
                delay(1000)
            )
            .subscribe(() => this._tauriService.invoke('close_splashscreen').subscribe());
    }
}
