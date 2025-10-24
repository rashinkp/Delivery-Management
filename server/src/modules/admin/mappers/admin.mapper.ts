
import { Admin } from 'src/schemas/admin.schema';
import { AdminResponseDto } from '../dto/admin-response.dto';

export class AdminMapper {
  static toResponseDto(admin: Admin): AdminResponseDto {
    return new AdminResponseDto(admin);
  }

  static toResponseDtoList(admins: Admin[]): AdminResponseDto[] {
    return admins.map((a) => new AdminResponseDto(a));
  }
}
