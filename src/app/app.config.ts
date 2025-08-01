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
import { mockApiServices } from 'app/mock-api';
import { MAT_PAGINATOR_DEFAULT_OPTIONS } from '@angular/material/paginator';
import { VOLUMETRIC_WEIGHT_FACTOR } from './core/shipment/shipment.constants';

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
            mockApi: {
                services: [...mockApiServices]
            },
            fuse: {
                layout: 'modern',
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
            }
        }),

        // Shipment volumetric weight factor
        {
            provide: VOLUMETRIC_WEIGHT_FACTOR,
            useValue: 500
        },

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
            provide: DateAdapter,
            useClass: LuxonDateAdapter,
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'D',
                },
                display: {
                    dateInput: 'DDD',
                    monthYearLabel: 'LLL yyyy',
                    dateA11yLabel: 'DD',
                    monthYearA11yLabel: 'LLLL yyyy',
                },
            },
        },

        // Material paginator defaults
        {
            provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
            useValue: {
                showFirstLastButtons: true,
                pageSizeOptions: [10, 15, 20, 25]
            }
        },
    ]
};
