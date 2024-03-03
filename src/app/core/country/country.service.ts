import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import countries from 'i18n-iso-countries';
import localeEn from 'i18n-iso-countries/langs/en.json';
import localeFr from 'i18n-iso-countries/langs/fr.json';
import { distinctUntilChanged, map, of, shareReplay, startWith, switchMap } from 'rxjs';

countries.registerLocale(localeEn);
countries.registerLocale(localeFr);

@Injectable({ providedIn: 'root' })
export class CountryService {

    countries$ = this._translocoService.langChanges$.pipe(
        startWith(this._translocoService.getActiveLang()),
        distinctUntilChanged(),
        switchMap(activeLang => of(countries.getNames(activeLang))),
        map(result => Object.entries(result)
            .map(([iso, name]) => ({ name, iso }))
        ),
        shareReplay()
    );

    /**
     * Constructor
     */
    constructor(
        private readonly _translocoService: TranslocoService
    ) { }
}
