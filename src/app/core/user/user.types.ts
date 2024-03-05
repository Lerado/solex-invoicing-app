export interface User {
    readonly id: number;
    cashierReference: string;
    cashierName: string;
    status?: string;
    avatar?: string;
}
