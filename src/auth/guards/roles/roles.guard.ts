/* eslint-disable @typescript-eslint/no-unused-vars */
// src/common/guards/roles.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/shared/decorators/roles.decorator";
import { UserService } from "src/users/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;
    const request = context.switchToHttp().getRequest();
    const userId = request.headers["user-id"];
    const user = await this.userService.findOne(+userId, { id: true, role: true });

    if (!user) throw new ForbiddenException("Access denied: User not found");
    if (!user.role) throw new ForbiddenException("Access denied: User has no role assigned");
    if (!user || !user.role) return false;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access denied: Requires one of these roles [${requiredRoles.join(", ")}]`,
      );
    }

    return true;
  }
}
