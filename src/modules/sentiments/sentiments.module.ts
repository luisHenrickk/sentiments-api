// sentiments.module.ts
import { Module } from '@nestjs/common'
import { SentimentsController } from './sentiments.controller'
import { SentimentsService } from './sentiments.service'
import { SentimentsRepository } from './sentiments.repository'
import { DynamoClientService } from 'modules/database/dynamodb-client.service'

@Module({
  controllers: [SentimentsController],
  providers: [SentimentsService, SentimentsRepository, DynamoClientService],
  exports: [SentimentsService, SentimentsRepository],
})
export class SentimentsModule {}
