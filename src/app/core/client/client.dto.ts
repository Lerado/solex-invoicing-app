export interface CreateClientDto {
    firstName: string;
    lastName: string;
    contact: string;
    address: string;
}

export type UpdateClientDto = Partial<CreateClientDto>;
