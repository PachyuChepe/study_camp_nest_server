import { IsNotEmpty } from 'class-validator';
import { SpaceMemberRole } from '../types/space-member-role.type';

export class ChangeMemberRoleDto {
  @IsNotEmpty()
  spaceId: number;

  @IsNotEmpty()
  targetUserId: number;

  @IsNotEmpty()
  newRole: SpaceMemberRole;
}
