import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, importProvidersFrom, inject, Provider, provideEnvironmentInitializer } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FUSE_MOCK_API_DEFAULT_DELAY, mockApiInterceptor } from '@fuse/lib/mock-api';
import { FuseConfig } from '@fuse/services/config';
import { FUSE_CONFIG } from '@fuse/services/config/config.constants';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { fuseLoadingInterceptor, FuseLoadingService } from '@fuse/services/loading';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FusePlatformService } from '@fuse/services/platform';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { FuseUtilsService } from '@fuse/services/utils';

export type FuseProviderConfig = {
    mockApi?: {
        delay?: number;
        services?: any[];
    },
    fuse?: FuseConfig
}

/**
 * Fuse provider
 */
export const provideFuse = (config: FuseProviderConfig): Array<Provider | EnvironmentProviders> => {
    // Base providers
    const providers: Array<Provider | EnvironmentProviders> = [
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill',
            },
        },
        {
            provide: FUSE_MOCK_API_DEFAULT_DELAY,
            useValue: config?.mockApi?.delay ?? 0,
        },
        {
            provide: FUSE_CONFIG,
            useValue: config?.fuse ?? {},
        },

        importProvidersFrom(MatDialogModule),
        provideEnvironmentInitializer(() => inject(FuseConfirmationService)),

        provideHttpClient(withInterceptors([fuseLoadingInterceptor])),
        provideEnvironmentInitializer(() => inject(FuseLoadingService)),

        provideEnvironmentInitializer(() => inject(FuseMediaWatcherService)),
        provideEnvironmentInitializer(() => inject(FusePlatformService)),
        provideEnvironmentInitializer(() => inject(FuseSplashScreenService)),
        provideEnvironmentInitializer(() => inject(FuseUtilsService)),
    ];

    // Mock Api services
    if (config?.mockApi?.services) {
        providers.push(
            provideHttpClient(withInterceptors([mockApiInterceptor])),
            ...config.mockApi.services.map(service => provideEnvironmentInitializer(() => inject(service)))
        );
    }

    // Return the providers
    return providers;
};
