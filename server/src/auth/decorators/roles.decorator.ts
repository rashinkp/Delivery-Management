import { SetMetadata } from '@nestjs/common';
import { USER_ROLES } from '../../common/constants/app-constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// Predefined role decorators for convenience
export const AdminOnly = () => Roles(USER_ROLES.ADMIN);
export const TruckDriverOnly = () => Roles(USER_ROLES.TRUCK_DRIVER);
export const AdminOrTruckDriver = () => Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER);
