import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { City } from './city.types';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CityService {
    private readonly _httpClient = inject(HttpClient);

    cities$ = this._httpClient.get<City[]>('api/cities').pipe(shareReplay());
}
