export class TruckDriverResponseDto {
  driverId: string;
  name: string;
  mobile: string;
  address: string;
  licenseNumber: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(driver: any) {
    this.driverId = driver._id?.toString() || driver.id?.toString();
    this.name = driver.name;
    this.mobile = driver.mobile;
    this.address = driver.address;
    this.licenseNumber = driver.licenseNumber;
    this.status = driver.status;
    this.createdAt = driver.createdAt;
    this.updatedAt = driver.updatedAt;
  }
}
