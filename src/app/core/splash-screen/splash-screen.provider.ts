import { EnvironmentProviders, Provider, inject, provideEnvironmentInitializer } from '@angular/core';
import { ExtendedSplashScreenService } from './splash-screen.service';

export const provideSplashScreen = (): Array<EnvironmentProviders | Provider> => [
    provideEnvironmentInitializer(() => inject(ExtendedSplashScreenService))
];
