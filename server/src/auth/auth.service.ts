import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminService } from '../services/admin.service';
import { TruckDriverService } from '../services/truck-driver.service';
import { LoginDto } from '../dto/auth/auth.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { USER_ROLES } from '../common/constants/app-constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
    private readonly truckDriverService: TruckDriverService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    this.logger.log('Attempting login', { mobile: loginDto.mobile });

    try {
      // Try to authenticate as admin first
      const admin = await this.adminService.validateCredentials(
        loginDto.mobile,
        loginDto.password,
      );
      
      if (admin) {
        const payload = {
          sub: admin.id,
          email: admin.email,
          role: admin.role,
          type: 'admin',
        };

        const accessToken = this.jwtService.sign(payload);
        
        this.logger.log('Admin login successful', { id: admin.id });
        
        return ResponseUtil.success({
          user: admin,
          accessToken,
          tokenType: 'Bearer',
          expiresIn: this.configService.get<string>('jwt.expiresIn'),
        }, 'Login successful');
      }
    } catch (error) {
      this.logger.debug('Admin login failed, trying truck driver', { error: error.message });
    }

    try {
      // Try to authenticate as truck driver
      const truckDriver = await this.truckDriverService.validateCredentials(
        loginDto.mobile,
        loginDto.password,
      );
      
      if (truckDriver) {
        const payload = {
          sub: truckDriver.id,
          mobile: truckDriver.mobile,
          role: truckDriver.role,
          type: 'truck_driver',
        };

        const accessToken = this.jwtService.sign(payload);
        
        this.logger.log('Truck driver login successful', { id: truckDriver.id });
        
        return ResponseUtil.success({
          user: truckDriver,
          accessToken,
          tokenType: 'Bearer',
          expiresIn: this.configService.get<string>('jwt.expiresIn'),
        }, 'Login successful');
      }
    } catch (error) {
      this.logger.debug('Truck driver login failed', { error: error.message });
    }

    this.logger.warn('Login failed for mobile', { mobile: loginDto.mobile });
    throw new UnauthorizedException('Invalid credentials');
  }

  async validateUser(id: string, role: string, type: string): Promise<any> {
    this.logger.debug('Validating user', { id, role, type });

    try {
      if (type === 'admin' && role === USER_ROLES.ADMIN) {
        return await this.adminService.findOne(id);
      } else if (type === 'truck_driver' && role === USER_ROLES.TRUCK_DRIVER) {
        return await this.truckDriverService.findOne(id);
      }
    } catch (error) {
      this.logger.debug('User validation failed', { id, role, type, error: error.message });
    }

    return null;
  }

  async refreshToken(user: any): Promise<any> {
    this.logger.log('Refreshing token', { id: user.id, role: user.role });

    const payload = {
      sub: user.id,
      email: user.email || user.mobile,
      role: user.role,
      type: user.type,
    };

    const accessToken = this.jwtService.sign(payload);
    
    return ResponseUtil.success({
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    }, 'Token refreshed successfully');
  }

  async logout(user: any): Promise<any> {
    this.logger.log('User logout', { id: user.id, role: user.role });
    
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    return ResponseUtil.success(null, 'Logout successful');
  }

  async getProfile(user: any): Promise<any> {
    this.logger.log('Getting user profile', { id: user.id, role: user.role });

    try {
      if (user.type === 'admin') {
        const admin = await this.adminService.findOne(user.id);
        return ResponseUtil.success(admin, 'Profile retrieved successfully');
      } else if (user.type === 'truck_driver') {
        const truckDriver = await this.truckDriverService.findOne(user.id);
        return ResponseUtil.success(truckDriver, 'Profile retrieved successfully');
      }
    } catch (error) {
      this.logger.error('Error getting profile', { id: user.id, error: error.message });
      throw new UnauthorizedException('User not found');
    }
  }
}
