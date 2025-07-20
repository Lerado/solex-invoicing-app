import { EnvironmentProviders, Provider } from '@angular/core';
import { provideNavigation } from './navigation/navigation.provider';
import { provideTransloco } from './transloco/transloco.provider';
import { provideIcons } from './icons/icons.provider';
import { provideSplashScreen } from './splash-screen/splash-screen.provider';
import { provideAuth } from './auth/auth.provider';
import { providePersistence } from './persistence/persistence.provider';
import { mockApiStores } from 'app/mock-api';
import { VOLUMETRIC_WEIGHT_FACTOR } from './shipment/shipment.constants';

export const provideCore = (): Array<EnvironmentProviders | Provider> => [

    // Auth
    provideAuth(),

    // Navigation
    provideNavigation(),

    // Transloco Config
    provideTransloco(),

    // Icon registries
    provideIcons(),

    // Splash screen
    provideSplashScreen(),

    // Persistence
    providePersistence([...mockApiStores]),

    {
        provide: VOLUMETRIC_WEIGHT_FACTOR,
        useValue: 500
    }
];
