import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, Provider, inject } from '@angular/core';
import { ExtendedSplashScreenService } from './splash-screen.service';

export const provideSplashScreen = (): Array<EnvironmentProviders | Provider> => [
    {
        provide: ENVIRONMENT_INITIALIZER,
        useValue: () => inject(ExtendedSplashScreenService),
        multi: true
    }
];
