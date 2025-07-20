import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@ngneat/transloco';
import countries from 'i18n-iso-countries';
import localeEn from 'i18n-iso-countries/langs/en.json';
import localeFr from 'i18n-iso-countries/langs/fr.json';
import { distinctUntilChanged, map, of, shareReplay, startWith, switchMap } from 'rxjs';
import { Country } from './country.types';

countries.registerLocale(localeEn);
countries.registerLocale(localeFr);

@Injectable({ providedIn: 'root' })
export class CountryService {

    private readonly _translocoService = inject(TranslocoService);

    private readonly _countries$ = this._translocoService.langChanges$.pipe(
        startWith(this._translocoService.getActiveLang()),
        distinctUntilChanged(),
        switchMap(activeLang => of(countries.getNames(activeLang))),
        map(result => Object.entries(result)
            .map(([iso, name]) => ({ name, iso }))
        ),
        shareReplay()
    );

    private readonly _countries = toSignal(this._countries$, { initialValue: [] });

    /**
     * Returns a reactive signal containing the list of countries.
     *
     * @returns {Signal<Country[]>} A `Signal` of an array of country objects, each with a `name` and `iso` code.
     */
    getCountries(): Signal<Country[]> {
        return computed(() => this._countries().sort((countryA, countryB) => countryA.name.localeCompare(countryB.name)));
    }
}
