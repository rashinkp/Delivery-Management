import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'default-secret',
    });
  }

  async validate(payload: any) {
    const { sub: id, role, type } = payload;
    
    if (!id || !role || !type) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Validate user exists and is active
    const user = await this.authService.validateUser(id, role, type);
    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      id: user._id.toString(),
      email: user.email || user.mobile,
      role: user.role,
      type,
      isActive: user.isActive,
    };
  }
}
