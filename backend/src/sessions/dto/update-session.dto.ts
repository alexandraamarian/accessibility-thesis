import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsObject, Min, Max } from 'class-validator';

export class UpdateSessionDto {
  @ApiProperty({ required: false, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  susScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  nasaTlx?: {
    mental?: number;
    physical?: number;
    temporal?: number;
    performance?: number;
    effort?: number;
    frustration?: number;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
