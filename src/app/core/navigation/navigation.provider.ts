import { Provider, EnvironmentProviders, ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NavigationService } from './navigation.service';

export const provideNavigation = (): Array<Provider | EnvironmentProviders> => {
    return [
        NavigationService,
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(NavigationService),
            multi: true
        }
    ];
};
