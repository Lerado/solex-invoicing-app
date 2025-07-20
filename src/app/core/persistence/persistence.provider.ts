import { EnvironmentProviders, Provider, inject, provideAppInitializer } from '@angular/core';
import { PersistenceService } from './persistence.service';
import { lastValueFrom } from 'rxjs';
import { HasMigrations } from './persistence.types';

export const providePersistence = (stores = []): Array<Provider | EnvironmentProviders> => [
    PersistenceService,
    provideAppInitializer(() => {
        const persistenceService = inject(PersistenceService);
        const storeServices = stores.map(store => inject(store) as HasMigrations);
        return lastValueFrom(
            persistenceService.runMigrations(
                storeServices.map(service => service.migrations ?? []).flat()
            )
        );
    })
];
