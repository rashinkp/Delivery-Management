export interface TruckDriver {
  driverId: string;
  name: string;
  mobile: string;
  address: string;
  licenseNumber: string;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTruckDriverDto {
  name: string;
  mobile: string;
  address: string;
  licenseNumber: string;
  password: string;
  status?: "active" | "inactive";
}

export interface UpdateTruckDriverDto {
  name?: string;
  mobile?: string;
  address?: string;
  licenseNumber?: string;
  password?: string;
  status?: "active" | "inactive";
}
