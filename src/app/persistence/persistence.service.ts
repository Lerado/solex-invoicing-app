import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, from, of, shareReplay, switchAll, switchMap } from 'rxjs';
import squel from 'squel';
import Database, { QueryResult } from 'tauri-plugin-sql';
import { Migrations } from './persistence.types';

export class PersistenceService {

    private readonly _dbConnection = 'sqlite:solex-invoicing.db';

    /**
     * Public query builder
     */
    readonly queryBuilder = squel;

    /**
     * Persistence object linked to backend db
     */
    readonly database$ = from(
        Database.load(this._dbConnection)
    )
        .pipe(
            takeUntilDestroyed(),
            shareReplay()
        );

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Execute select upon persistence
     *
     * @param query
     */
    executeSelect<T>(query: string): Observable<T> {
        return this.database$.pipe(
            switchMap(db => db.select<T>(query))
        );
    }

    /**
     * Execute INSERT, UPDATE, DELETE upon persistence
     *
     * @param query
     */
    executeQuery(query: string): Observable<QueryResult> {
        return this.database$.pipe(
            switchMap(db => db.execute(query))
        );
    }

    /**
     * Run database migrations
     *
     * @param migrations
     */
    runMigrations(migrations: Migrations): Observable<unknown> {
        if (!migrations.length) {
            return of(true);
        }
        return of(
            ...migrations
                .sort((one, another) => one.priority - another.priority)
                .map(({ query, ignoreIf }) => {
                    if (ignoreIf) {
                        return this.executeSelect(ignoreIf)
                            .pipe(
                                switchMap((result: unknown[]) => {
                                    if (result.length) {
                                        return of(true);
                                    }
                                    return this.executeQuery(query);
                                })
                            );
                    }
                    return this.executeQuery(query);
                })
        )
            .pipe(switchAll());

    }
}
