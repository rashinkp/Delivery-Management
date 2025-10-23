
import { VendorResponseDto } from '../dto/vendor-response.dto';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';

export interface IVendorService {
  create(createVendorDto: CreateVendorDto): Promise<VendorResponseDto>;
  findAll(): Promise<VendorResponseDto[]>;
  findById(id: string): Promise<VendorResponseDto>;
  update(id: string, updateVendorDto: UpdateVendorDto): Promise<VendorResponseDto>;
  remove(id: string): Promise<void>;
  findByEmail(email: string): Promise<VendorResponseDto>;
  findByContactNumber(contactNumber: string): Promise<VendorResponseDto>;
  findByLocation(location: string): Promise<VendorResponseDto[]>;
}
