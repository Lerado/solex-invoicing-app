import { Provider, EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';
import { NavigationService } from './navigation.service';

export const provideNavigation = (): Array<Provider | EnvironmentProviders> => {
    return [
        NavigationService,
        provideEnvironmentInitializer(() => inject(NavigationService))
    ];
};
