
import { Vendor } from 'src/schemas/vendor.schema';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';

export interface IVendorService {
  create(createVendorDto: CreateVendorDto): Promise<Vendor>;
  findAll(): Promise<Vendor[]>;
  findById(id: string): Promise<Vendor>;
  update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor>;
  remove(id: string): Promise<void>;
  findByEmail(email: string): Promise<Vendor>;
  findByContactNumber(contactNumber: string): Promise<Vendor>;
  findByLocation(location: string): Promise<Vendor[]>;
}
