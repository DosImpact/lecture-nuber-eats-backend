import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

// UserRole는 enum이고 keyof + typeof 로 enum에 지정된 string을 가져올 수 있다.
export type AllowRoles = keyof typeof UserRole | 'Any';

export const Role = (roles: AllowRoles[]) => SetMetadata('roles', roles);
