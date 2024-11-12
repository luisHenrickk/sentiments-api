import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

@Injectable()
export class DynamoClientService
  extends DynamoDB
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      region: "us-east-1",
    })
  }

  onModuleInit() {
    return this
  }

  onModuleDestroy() {
    this.destroy()
  }
}
