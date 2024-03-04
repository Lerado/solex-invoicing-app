import { EnvironmentProviders, Provider } from '@angular/core';
import { provideNavigation } from './navigation/navigation.provider';
import { provideTransloco } from './transloco/transloco.provider';
import { provideIcons } from './icons/icons.provider';
import { provideSplashScreen } from './splash-screen/splash-screen.provider';

export const provideCore = (): Array<EnvironmentProviders | Provider> => [

    // Navigation
    provideNavigation(),

    // Transloco Config
    provideTransloco(),

    // Icon registries
    provideIcons(),

    // Splash screen
    provideSplashScreen()

];
