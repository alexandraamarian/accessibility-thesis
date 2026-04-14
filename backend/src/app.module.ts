import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SessionsModule } from './sessions/sessions.module';
import { EventsModule } from './events/events.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [DatabaseModule, SessionsModule, EventsModule, AnalyticsModule],
})
export class AppModule {}
