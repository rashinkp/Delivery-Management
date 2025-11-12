export class TruckDriverResponseDto {
  driverId: string;
  name: string;
  mobile: string;
  address: string;
  licenseNumber: string;
  status: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(driver: any) {
    this.driverId = driver._id?.toString() || driver.id?.toString();
    this.name = driver.name;
    this.mobile = driver.mobile;
    this.address = driver.address;
    this.licenseNumber = driver.licenseNumber;
    this.status = driver.status;
    this.isDeleted = !!driver.isDeleted;
    this.deletedAt = driver.deletedAt ?? null;
    this.createdAt = driver.createdAt;
    this.updatedAt = driver.updatedAt;
  }
}
