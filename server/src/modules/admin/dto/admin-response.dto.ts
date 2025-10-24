import { Expose } from 'class-transformer';

export class AdminResponseDto {
  @Expose()
  adminId: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(admin: any) {
    this.adminId = admin._id?.toString();
    this.email = admin.email;
    this.name = admin.name;
    this.role = admin.role;
    this.createdAt = admin.createdAt;
    this.updatedAt = admin.updatedAt;
  }
}
