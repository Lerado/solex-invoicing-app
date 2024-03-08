import { SignUpDto } from 'app/core/auth/auth.dto';
import { User } from 'app/core/user/user.types';

export type UserModel = Readonly<User & { rootPassword: string }>;

export type CreateUserModelDto = Readonly<Omit<SignUpDto, 'rootPasswordConfirmation'>>;
