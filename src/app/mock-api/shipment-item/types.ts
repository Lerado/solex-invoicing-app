export interface ShipmentItemModel {
    readonly id: number;
    shipmentId: number;
    designation: string;
    quantity: number;
    createdAt: number | null;
    updatedAt: number | null;
    deletedAt: number | null;
}
