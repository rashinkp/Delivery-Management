export class VendorResponseDto {
  vendorId: string;
  name: string;
  location: string;
  contactNumber: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(vendor: any) {
    this.vendorId = vendor._id?.toString() || vendor.id?.toString();
    this.name = vendor.name;
    this.location = vendor.location;
    this.contactNumber = vendor.contactNumber;
    this.email = vendor.email;
    this.address = vendor.address;
    this.createdAt = vendor.createdAt;
    this.updatedAt = vendor.updatedAt;
  }
}
