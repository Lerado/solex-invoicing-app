import { CreateClientDto } from 'app/core/client/client.dto';
import { Client } from 'app/core/client/client.types';

export type ClientModel = Readonly<Client>;

export type CreateClientModelDto = Readonly<CreateClientDto>;
