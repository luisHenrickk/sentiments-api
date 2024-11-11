// sentiments.module.ts
import { Module } from '@nestjs/common'
import { SentimentsController } from './sentiments.controller'
import { SentimentsService } from './sentiments.service'
import { SentimentsRepository } from './sentiments.repository'
import { DynamoClientService } from 'modules/database/dynamodb-client.service'
import { ComprehendClient } from '@aws-sdk/client-comprehend'

@Module({
  controllers: [SentimentsController],
  providers: [
    SentimentsService,
    SentimentsRepository,
    DynamoClientService,
    ComprehendClient,
  ],
  exports: [SentimentsService, SentimentsRepository],
})
export class SentimentsModule {}
