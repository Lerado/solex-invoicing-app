import { httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { City } from './city.types';

@Injectable({ providedIn: 'root' })
export class CityService {

    private readonly _citiesResource: HttpResourceRef<City[]> = httpResource<City[]>(() => 'api/cities');

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Retrieves a resource reference for the list of cities.
     * If the resource reference does not exist, it initializes it with the API endpoint.
     * This method ensures that the cities resource is only created once and reused for subsequent calls.
     *
     * @returns {HttpResourceRef<City[]>} The resource reference for the cities API.
     */
    getCitiesResource() {
        return this._citiesResource;
    }

    /**
     * Retrieves a computed list of cities sorted alphabetically by their names.
     * Internally, it fetches the cities resource and returns a reactive computed value
     * that automatically updates when the underlying data changes.
     *
     * @returns {ComputedRef<City[]>} A computed reference to an array of cities sorted by name.
     */
    getCities() {
        return computed(() => this._citiesResource.value()?.sort((cityA, cityB) => cityA.name.localeCompare(cityB.name)) || []);
    }
}
