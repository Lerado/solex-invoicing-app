import { APP_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
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
    {
        // Preload the default language before the app starts to prevent empty/jumping content
        provide: APP_INITIALIZER,
        useFactory: (): () => unknown => {
            const translocoService = inject(TranslocoService);
            const defaultLang = translocoService.getDefaultLang();
            translocoService.setActiveLang(defaultLang);

            return () => firstValueFrom(translocoService.load(defaultLang));
        },
        multi: true,
    },
];
