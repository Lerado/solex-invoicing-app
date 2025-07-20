import { DataSource as BaseDataSource, CollectionViewer } from '@angular/cdk/collections';
import { SortDirection } from '@angular/material/sort';
import { BehaviorSubject, catchError, filter, finalize, map, Observable, of } from 'rxjs';

export interface Pagination<T> {
    pageSize: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;

    items?: T[];

    prev: string | boolean;
    next: string | boolean;
}

export interface PaginationDto {
    limit?: number;
    page?: number;
    paginate?: boolean;
}

export const defaultPaginationDto: PaginationDto = {
    limit: 10,
    page: 1
};

export interface SortingDto {
    sort?: SortDirection;
    sortKey?: string;
}

export const defaultSortingDto: SortingDto = {
    sort: 'desc',
    sortKey: 'id'
};

export interface SearchParams {
    query?: string
}

export type QueryParams = PaginationDto & SortingDto & SearchParams

export const computeQueryParams = (paginationParams: PaginationDto = {}, sortingParams: SortingDto = {}, query = ''): QueryParams => {
    const shouldPaginate = paginationParams.paginate ?? true;
    const pagination: PaginationDto = Object.assign(
        { ...defaultPaginationDto },
        Object.assign({ ...paginationParams }, shouldPaginate ? {} : { limit: -1 })
    );
    const sorting = Object.assign({ ...defaultSortingDto }, sortingParams);
    return { ...pagination, ...sorting, query };
};

// export type DataProviderFn<T> = (...params: unknown[]) => Observable<T[]>;
export type DataProviderFn<T> = ((paginationParams?: PaginationDto, sortingParams?: SortingDto, query?: string, ...nextParams: unknown[]) => Observable<T>) |
    ((...params: unknown[]) => Observable<T>);

export interface DataProvider<T> {

    /**
     * Get items according to pagination, sorting and search params
     */
    get: DataProviderFn<T>;
}

/**
 * Data source class with enhanced functionalities
 */
export class DataSource<T> extends BaseDataSource<T> {

    protected readonly _dataSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
    protected readonly _loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    /**
     * Constructor
     */
    constructor(
        protected readonly _dataService: DataProvider<T[]>
    ) {
        super();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get loading$(): Observable<boolean> {
        return this._loadingSubject.asObservable();
    }

    get items$(): Observable<T[]> {
        return this._dataSubject.asObservable();
    }

    get totalCount$(): Observable<number> {
        return this.items$.pipe(
            map(items => items.length)
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Connect
     *
     * @param _collectionViewer
     */
    override connect(_collectionViewer?: CollectionViewer): Observable<T[]> {
        return this._dataSubject.asObservable();
    }

    /**
     * Disconnect
     *
     * @param _collectionViewer
     */
    override disconnect(_collectionViewer?: CollectionViewer): void {
        this._dataSubject.complete();
        this._loadingSubject.complete();
    }

    /**
     * Load from data source
     *
     * @param params
     */
    load(...params: unknown[]): void {

        this._loadingSubject.next(true);

        this._dataService.get(...params).pipe(
            catchError(() => of([] as T[])),
            finalize(() => this._loadingSubject.next(false))
        )
            .subscribe({
                next: items => this._dataSubject.next(items as T[])
            });
    }
}

/**
 * Paginated data source class
 *
 * This class extends Angular's DataSource class with pagination, sorting and filtering.
 */
export class PaginatedDataSource<T> extends BaseDataSource<T> {

    protected readonly _dataSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
    protected readonly _loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    private readonly _paginationSubject: BehaviorSubject<Pagination<T>> = new BehaviorSubject<Pagination<T>>(null);

    /**
     * Constructor
     */
    constructor(
        protected readonly _dataService: DataProvider<Pagination<T>>
    ) {
        super();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get loading$(): Observable<boolean> {
        return this._loadingSubject.asObservable();
    }

    get items$(): Observable<T[]> {
        return this._dataSubject.asObservable();
    }

    get pagination$(): Observable<Pagination<T>> {
        return this._paginationSubject.asObservable().pipe(
            filter(value => value !== null)
        );
    }

    get totalCount$(): Observable<number> {
        return this.pagination$.pipe(
            map(pagination => pagination.totalItems)
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Connect
     *
     * @param _collectionViewer
     */
    override connect(_collectionViewer?: CollectionViewer): Observable<T[]> {
        return this._dataSubject.asObservable();
    }

    /**
     * Disconnect
     *
     * @param _collectionViewer
     */
    override disconnect(_collectionViewer?: CollectionViewer): void {
        this._dataSubject.complete();
        this._loadingSubject.complete();
    }

    /**
     * Load from data source
     *
     * @param paginationParams
     * @param sortingParams
     * @param query
     */
    load(paginationParams?: PaginationDto, sortingParams?: SortingDto, query = '', ...nextParams: unknown[]): void {

        this._loadingSubject.next(true);

        const pagination: PaginationDto = Object.assign({ ...defaultPaginationDto }, paginationParams);
        const sorting = Object.assign({ ...defaultSortingDto }, sortingParams);

        this._dataService.get(pagination, sorting, query, ...nextParams).pipe(
            catchError(() => of({
                pageSize: pagination.page,
                currentPage: 1,
                totalItems: 0,
                totalPages: 1,
                items: [],
                prev: null,
                next: null
            } as Pagination<T>)),
            finalize(() => this._loadingSubject.next(false))
        )
            .subscribe((response) => {
                const { items, ...params } = response as Pagination<T>;
                this._paginationSubject.next(params);
                this._dataSubject.next(items);
            });
    }
}
