import { EnvironmentProviders, Provider } from '@angular/core';
import { provideNavigation } from './navigation/navigation.provider';
import { provideTransloco } from './transloco/transloco.provider';
import { provideIcons } from './icons/icons.provider';

export const provideCore = (): Array<EnvironmentProviders | Provider> => [

    // Navigation
    provideNavigation(),

    // Transloco Config
    provideTransloco(),

    // Icon registries
    provideIcons()

];
