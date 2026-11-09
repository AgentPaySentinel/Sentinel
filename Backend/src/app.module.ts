import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Reusable infrastructure
import { RedisModule } from './redis/redis.module';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';
import { ThrottleModule } from './throttle/throttle.module';
import { HealthModule } from './health/health.module';
import { ConfigValidationService } from './config/config-validation.service';
import { RolesGuard } from './guards/roles.guard';

// AgentPay Sentinel domain modules
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { PaymentsModule } from './payments/payments.module';
import { TestingEngineModule } from './testing-engine/testing-engine.module';
import { ChaosLabModule } from './chaos-lab/chaos-lab.module';
import { PolicyEngineModule } from './policy-engine/policy-engine.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { SettlementModule } from './settlement/settlement.module';
import { ReportsModule } from './reports/reports.module';
import { X402AdapterModule } from './adapters/x402/x402.module';
import { StellarAdapterModule } from './adapters/stellar/stellar.module';

// Entities — auth / audit (reusable infrastructure)
import { User } from './auth/entities/user.entity';
import { WalletBinding } from './auth/entities/wallet-binding.entity';
import { LoginNonce } from './auth/entities/login-nonce.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { ApiToken } from './auth/entities/api-token.entity';
import { AuditLog, AuditLogArchive } from './audit/audit.entity';

// Entities — AgentPay Sentinel domain
import { UserProfile } from './users/entities/user-profile.entity';
import { Project } from './projects/entities/project.entity';
import { ProjectMember } from './projects/entities/project-member.entity';
import { Payment } from './payments/entities/payment.entity';
import { PaymentAttempt } from './payments/entities/payment-attempt.entity';
import { TestScenario } from './testing-engine/entities/test-scenario.entity';
import { TestRun } from './testing-engine/entities/test-run.entity';
import { FailureProfile } from './chaos-lab/entities/failure-profile.entity';
import { Policy } from './policy-engine/entities/policy.entity';
import { PaymentEvent } from './monitoring/entities/payment-event.entity';
import { Settlement } from './settlement/entities/settlement.entity';
import { Report } from './reports/entities/report.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USERNAME') || 'postgres',
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE') || 'agentpay_sentinel',
        entities: [
          // auth / audit
          User,
          WalletBinding,
          LoginNonce,
          RefreshToken,
          ApiToken,
          AuditLog,
          AuditLogArchive,
          // AgentPay Sentinel domain
          UserProfile,
          Project,
          ProjectMember,
          Payment,
          PaymentAttempt,
          TestScenario,
          TestRun,
          FailureProfile,
          Policy,
          PaymentEvent,
          Settlement,
          Report,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),

    // Reusable infrastructure
    RedisModule,
    AuthModule,
    QueueModule,
    AuditModule,
    ThrottleModule,
    HealthModule,

    // AgentPay Sentinel domain
    UsersModule,
    ProjectsModule,
    PaymentsModule,
    ChaosLabModule,
    PolicyEngineModule,
    MonitoringModule,
    SettlementModule,
    TestingEngineModule,
    ReportsModule,
    X402AdapterModule,
    StellarAdapterModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    ConfigValidationService,

    /**
     * Global RBAC enforcement. Applies @Roles() checks across all controllers.
     * Routes without a @Roles() decorator are allowed through by default.
     */
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
