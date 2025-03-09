import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HR_ROLE_KEY } from '../decorators/hr-role.decorator';

@Injectable()
export class HrRoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiresHrRole = this.reflector.getAllAndOverride<boolean>(HR_ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Si la ruta no requiere rol HR, permitir acceso
        if (!requiresHrRole) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user?.is_hr) {
            throw new ForbiddenException('Solo los usuarios de recursos humanos pueden acceder a este recurso');
        }

        return true;
    }
} 