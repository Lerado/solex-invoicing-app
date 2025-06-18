import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, inject, Provider, provideEnvironmentInitializer } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';

export const provideAuth = (): Array<Provider | EnvironmentProviders> => [
    provideHttpClient(),
    provideEnvironmentInitializer(() => inject(AuthService)),
];
