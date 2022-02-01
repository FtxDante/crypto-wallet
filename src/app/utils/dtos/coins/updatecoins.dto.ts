import { PartialType } from '@nestjs/mapped-types';
import { CreateCoinDto } from './createcoin.dto';

export class UpdateCoinDto extends PartialType(CreateCoinDto) {}
