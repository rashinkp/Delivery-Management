import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get roles attached to the route
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true; // no role restriction

    // Get user from request (injected by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Check if user’s role is in the allowed roles
    return requiredRoles.includes(user.role);
  }
}
