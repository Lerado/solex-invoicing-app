import { SignUpDto } from 'app/core/auth/auth.dto';

export type CreateUserModelDto = Readonly<Omit<SignUpDto, 'rootPasswordConfirmation'>>;
