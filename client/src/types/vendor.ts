export interface Vendor {
  vendorId: string;
  name: string;
  location: string;
  contactNumber: string;
  email: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorDto {
  name: string;
  location: string;
  contactNumber: string;
  email: string;
  address: string;
}

export interface UpdateVendorDto {
  name?: string;
  location?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
}

