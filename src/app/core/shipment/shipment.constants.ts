import { InjectionToken } from '@angular/core';

/**
 * Shipment volumetric weight factor
 *
 * Represents the equivalent weight in kg of a `1 x 1 x 1` shipment cube.
 */
export const VOLUMETRIC_WEIGHT_FACTOR = new InjectionToken<number>('VOLUMETRIC_WEIGHT_FACTOR');
