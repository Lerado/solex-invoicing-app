import { SignUpDto } from 'app/core/auth/auth.dto';
import { User } from 'app/core/user/user.types';

export type UserModel = Readonly<User & { rootPassword: string }>;

