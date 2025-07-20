export interface Migration {
    /**
     * Ascendant priority
     */
    priority: number;
    /**
     * Query to execute
     */
    query: string;
    /**
     * Condition to run before running the migration
     * This migration will run if the result is empty
     * This is always a SELECT query
     */
    ignoreIf?: string;
}

export type Migrations = Migration[];

export interface HasMigrations {
    /**
     * The migrations this store need to run on app init
     */
    get migrations(): Migrations
}
