import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ITruckDriverService } from '../../modules/truck-driver/interfaces/truck-driver.service.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('ITruckDriverService')
    private readonly driverService: ITruckDriverService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get roles attached to the route
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true; // no role restriction

    // Get user from request (injected by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Check if user's role is in the allowed roles
    if (!requiredRoles.includes(user.role)) {
      return false;
    }

    // If user is a driver, check their status
    if (user.role === 'driver') {
      try {
        const driver = await this.driverService.findById(user.sub);

        if ((driver as any)?.isDeleted) {
          throw new ForbiddenException(
            'Your account has been removed. Please contact the administrator.',
          );
        }

        if (driver.status === 'inactive') {
          throw new ForbiddenException(
            'Your account has been blocked. Please contact the administrator for assistance.',
          );
        }
      } catch (error) {
        if (error instanceof ForbiddenException) {
          throw error;
        }

        if (error instanceof NotFoundException) {
          throw new ForbiddenException(
            'Your account is no longer active. Please contact the administrator.',
          );
        }

        throw new ForbiddenException(
          'Access denied. Please contact the administrator.',
        );
      }
    }

    return true;
  }
}
