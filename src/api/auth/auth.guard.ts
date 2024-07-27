import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../../domain/user/user.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './auth.decorator';

export const REQUEST_USER_KEY = 'user';

interface BasicAuth {
  username: string;
  password: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private userService: UserService,
    private reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.shouldBypassAuth(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const basic_auth = this.extractAuthFromHeader(request);
    if (!basic_auth) {
      this.logger.debug('Request missing valid basic auth header');
      throw new UnauthorizedException();
    }

    const user = await this.userService.authenticate(
      basic_auth.username,
      basic_auth.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    request[REQUEST_USER_KEY] = user;

    return true;
  }

  private shouldBypassAuth(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private extractAuthFromHeader(request: Request): BasicAuth | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Basic') {
      this.logger.debug(`Received token of unsupported type ${type}`);
      return undefined;
    }

    const decoded = atob(token);
    const [username, password] = decoded.split(':') ?? [];
    if (!username || !password) {
      this.logger.debug(`Missing username or password in basic auth header`);
      return undefined;
    }

    return { username, password };
  }
}
