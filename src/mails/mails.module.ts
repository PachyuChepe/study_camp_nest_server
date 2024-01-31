import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from './entities/mail.entity';
import { SpaceMember } from 'src/space-members/entities/space-member.entity';
import { GroupMembersModule } from 'src/group-members/group-members.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mail, SpaceMember]), GroupMembersModule],
  controllers: [MailsController],
  providers: [MailsService, MailsController],
  exports: [MailsController],
})
export class MailsModule {}
