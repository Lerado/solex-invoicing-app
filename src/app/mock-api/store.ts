import { Injectable, inject } from '@angular/core';
import { PersistenceService } from 'app/core/persistence/persistence.service';

@Injectable({ providedIn: 'root' })
export class Store {

    protected readonly _persistence = inject(PersistenceService);
}
