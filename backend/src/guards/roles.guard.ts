import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Roles } from "src/decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }

        const gqlContext = GqlExecutionContext.create(context);
        const { headers } = gqlContext.getContext().req;

        const role = (headers.authorization ?? "").split(' ')[1];

        if(roles.includes(role)) {
            return true;
        } else {
            throw new UnauthorizedException('You are not authorized to do this action.');
        }
        
    }
}