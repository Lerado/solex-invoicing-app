import { APP_INITIALIZER, EnvironmentProviders, Provider } from '@angular/core';
import { PersistenceService } from './persistence.service';
import { HasMigrations } from './persistence.types';
import { lastValueFrom } from 'rxjs';

export const providePersistence = (stores = []): Array<Provider | EnvironmentProviders> => [
    PersistenceService,
    {
        provide: APP_INITIALIZER,
        deps: [PersistenceService, ...stores],
        useFactory: (persistenceService: PersistenceService, ...storeServices: HasMigrations[]) => (): unknown => {
            return lastValueFrom(
                persistenceService.runMigrations(
                    storeServices.map(service => service.migrations ?? []).flat()
                )
            );
        },
        multi: true,
    }
];
