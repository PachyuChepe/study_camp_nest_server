import { PickType } from '@nestjs/mapped-types';
import { Dm } from '../entities/dm.entity';

export class CreateDmDto extends PickType(Dm, ['content']) {}
