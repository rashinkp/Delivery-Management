import { Vendor } from '../../../schemas/vendor.schema';
import { VendorResponseDto } from '../dto/vendor-response.dto';

export class VendorMapper {
  static toResponseDto(vendor: Vendor): VendorResponseDto {
    return new VendorResponseDto(vendor);
  }

  static toResponseDtoList(vendors: Vendor[]): VendorResponseDto[] {
    return vendors.map(vendor => this.toResponseDto(vendor));
  }
}
