import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withInMemoryScrolling, withPreloading, withViewTransitions } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCore } from './core/core.provider';
import { provideTitleStrategy } from 'ngx-title-strategy';
import { provideFuse } from '@fuse/fuse.provider';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
    providers: [

        provideAnimationsAsync(),

        provideRouter(appRoutes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
            withComponentInputBinding(),
            withViewTransitions()),

        // Core modules
        provideCore(),

        // Title strategy
        provideTitleStrategy('{{ title }} | Solex Invoicing'),

        // Fuse
        provideFuse({
            fuse: {
                layout: 'enterprise',
                scheme: 'light',
                screens: {
                    sm: '600px',
                    md: '960px',
                    lg: '1280px',
                    xl: '1440px',
                },
                theme: 'theme-brand',
                themes: [
                    {
                        id: 'theme-brand',
                        name: 'Brand',
                    }
                ],
            },
        }),

        // Locale
        {
            provide: LOCALE_ID,
            useValue: 'fr-FR'
        },
        {
            provide: DEFAULT_CURRENCY_CODE,
            useValue: 'XAF'
        },

        // Material Date Adapter
        {
            provide : DateAdapter,
            useClass: LuxonDateAdapter,
        },
        {
            provide : MAT_DATE_FORMATS,
            useValue: {
                parse  : {
                    dateInput: 'D',
                },
                display: {
                    dateInput         : 'DDD',
                    monthYearLabel    : 'LLL yyyy',
                    dateA11yLabel     : 'DD',
                    monthYearA11yLabel: 'LLLL yyyy',
                },
            },
        },
    ]
};
