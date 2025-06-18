import { EnvironmentProviders, inject, Provider, provideAppInitializer } from '@angular/core';
import { TranslocoService, provideTransloco as provideTransloco_ } from '@ngneat/transloco';
import { TranslocoHttpLoader } from 'app/core/transloco/transloco.http-loader';
import { firstValueFrom } from 'rxjs';

export const provideTransloco = (): Array<Provider | EnvironmentProviders> => [
    provideTransloco_({
        config: {
            availableLangs: [
                {
                    id: 'fr',
                    label: 'Français',
                },
                {
                    id: 'en',
                    label: 'English',
                }
            ],
            defaultLang: 'fr',
            fallbackLang: 'fr',
            reRenderOnLangChange: true,
            prodMode: true,
        },
        loader: TranslocoHttpLoader
    }),
    provideAppInitializer(() => {
        const translocoService = inject(TranslocoService);
        const defaultLang = translocoService.getDefaultLang();
        translocoService.setActiveLang(defaultLang);

        return firstValueFrom(translocoService.load(defaultLang));
    }),
];
