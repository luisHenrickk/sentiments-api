import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { globalConfig } from './config/global.config'
import { SentimentsRepository } from 'modules/sentiments/sentiments.repository'
import { DynamoClientService } from 'modules/database/dynamodb-client.service'
import { SentimentsModule } from 'modules/sentiments/sentiments.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => globalConfig],
    }),
    SentimentsModule,
  ],
  providers: [SentimentsRepository, DynamoClientService],
})
export class AppModule {}
