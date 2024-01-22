import { Module } from '@nestjs/common';
import { RavenModule } from 'nest-raven';
// import { AppController } from './app.controller'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
// import { AppService } from './app.service'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ErrorLoggingModule } from './auth/error-logging/error-logging.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
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
import { GroupMember } from './group-members/entities/group-members.entity';
import { Lecture } from './lectures/entities/lecture.entity';
import { LectureItem } from './lecture-items/entities/lecture-items.entity';
import { LectureProgress } from './lecture-progress/dto/entities/lecture-progress.entity';
import { Alarm } from './alarms/entities/alarm.entity';
import { Mail } from './mails/entities/mail.entity';
import { AllExceptionsFilter } from './auth/error-logging/error-logging.service';
import { SpaceMemberDauModule } from './space-member-dau/space-member-dau.module';
import { GroupMembersModule } from './group-members/group-members.module';
import { LectureItemsModule } from './lecture-items/lecture-items.module';
import { LectureProgressModule } from './lecture-progress/lecture-progress.module';

// 결제 API 테스트 클라이언트 정적 연결
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SseModule } from './sse/sse.module';
import { DmsModule } from './dms/dms.module';
import { Dm } from './dms/entities/dm.entity';

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
      Dm,
    ],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'test_pay_client'), // 'public' 디렉토리 지정
    }),
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
    RavenModule,
    ErrorLoggingModule,
    SpaceMemberDauModule,
    GroupMembersModule,
    LectureItemsModule,
    LectureProgressModule,
    SseModule,
    DmsModule,
  ],
  controllers: [
    // AppController
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // AppService,
  ],
})
export class AppModule {}
