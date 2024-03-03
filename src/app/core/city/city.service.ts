import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from './city.types';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CityService {

    cities$ = this._httpClient.get<City[]>('api/cities').pipe(shareReplay());

    /**
     * Constructor
     */
    constructor(
        private readonly _httpClient: HttpClient
    ) { }
}
