import { IsNotEmpty } from 'class-validator';

export class ChangeMemberRoleDto {
  @IsNotEmpty()
  spaceId: number;

  @IsNotEmpty()
  targetUserId: number;

  @IsNotEmpty()
  newRole: any;
}
