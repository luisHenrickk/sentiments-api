import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

@Injectable()
export class DynamoClientService
  extends DynamoDB
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      region: process.env.REGION,
    })
  }

  onModuleInit() {
    return this
  }

  onModuleDestroy() {
    this.destroy()
  }
}
