import { Injectable, inject } from '@angular/core';
import { PersistenceService } from '../persistence/persistence.service';

@Injectable({ providedIn: 'root' })
export class Store {

    protected readonly _persistence = inject(PersistenceService);
}
