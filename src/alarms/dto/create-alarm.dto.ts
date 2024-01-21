import { PickType } from '@nestjs/mapped-types';
import { Alarm } from '../entities/alarm.entity';

export class CreateAlarmDto extends PickType(Alarm, ['time', 'type']) {}
