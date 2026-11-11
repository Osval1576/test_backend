import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNotEmpty, IsPositive, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  product!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsPositive()
  price!: number;
}

export class CreateOrderDto {
  @IsUUID()
  customerId!: string;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
