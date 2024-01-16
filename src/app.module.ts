import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { SpacesModule } from './spaces/spaces.module';
import { SpaceMembersModule } from './space-members/space-members.module';
import { GroupModule } from './group/group.module';
import { LecturesModule } from './lectures/lectures.module';
import { MailsModule } from './mails/mails.module';
import { AlarmsModule } from './alarms/alarms.module';
import Joi from 'joi';
import { User } from './users/entities/user.entity';
import { Space } from './spaces/entities/space.entity';
import { SpaceClass } from './spaces/entities/space-class.entity';
import { SpaceMember } from './space-members/entities/space-member.entity';
import { SpaceMemberDau } from './space-members/entities/space-member-dau.entity';
import { Group } from './group/entities/group.entity';
import { GroupMember } from './group/entities/group-members.entity';
import { Lecture } from './lectures/entities/lecture.entity';
import { LectureItem } from './lectures/entities/lecture-items.entity';
import { LectureProgress } from './lectures/entities/lecture-progress.entity';
import { Alarm } from './alarms/entities/alarm.entity';
import { Mail } from './mails/entities/mail.entity';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [
      User,
      SpaceClass,
      Space,
      SpaceMember,
      SpaceMemberDau,
      Group,
      GroupMember,
      Lecture,
      LectureItem,
      LectureProgress,
      Alarm,
      Mail,
    ],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    RedisModule,
    AuthModule,
    UsersModule,
    SpacesModule,
    SpaceMembersModule,
    GroupModule,
    LecturesModule,
    MailsModule,
    AlarmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
