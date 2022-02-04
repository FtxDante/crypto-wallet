import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletDto } from './createwallet.dto';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {}
