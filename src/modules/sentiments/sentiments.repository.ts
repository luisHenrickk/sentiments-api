import { Injectable } from '@nestjs/common'
import {
  PutItemCommand,
  ScanCommand,
  ScanCommandOutput,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { DynamoClientService } from 'modules/database/dynamodb-client.service'
import { randomUUID } from 'crypto'
import { SentimentsFilters } from './types/sentiments.type'
import { SentimentContentDto } from './dtos/sentiments.dto'

@Injectable()
export class SentimentsRepository {
  constructor(private readonly client: DynamoClientService) {}

  async scanTable(filters?: SentimentsFilters): Promise<ScanCommandOutput> {
    let params: any = {
      TableName: process.env.DYNAMODB_TABLE,
    }

    const filterExpressions = []
    const expressionAttributeValues: any = {}

    if (filters?.sentiment) {
      filterExpressions.push('content.sentiment = :sentiment')
      expressionAttributeValues[':sentiment'] = { S: filters.sentiment }
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ')
      params.ExpressionAttributeValues = marshall(expressionAttributeValues)
    }

    const command = new ScanCommand(params)
    return this.client.send(command)
  }

  async saveSentiment(content: SentimentContentDto): Promise<void> {
    const dateTime = new Date().toISOString()
    const sentimentId = randomUUID()

    const command = new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: marshall(
        {
          PK: `SENTIMENTS`,
          SK: `DETAILS-${sentimentId}`,
          content,
          createdAt: dateTime,
          updatedAt: dateTime,
        },
        {
          convertClassInstanceToMap: true,
        },
      ),
    })

    await this.client.send(command)
  }

  async getSentimentById(sentimentId: string): Promise<SentimentContentDto> {
    const command = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: marshall({
        PK: `SENTIMENTS`,
        SK: `DETAILS-${sentimentId}`,
      }),
    })

    const response = await this.client.send(command)
    if (!response.Item) {
      throw new Error('Sentiment not found')
    }

    return unmarshall(response.Item) as SentimentContentDto
  }

  async updateSentiment(
    sentimentId: string,
    updatedContent: SentimentContentDto,
  ): Promise<void> {
    const dateTime = new Date().toISOString()

    const command = new UpdateItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: marshall({
        PK: `SENTIMENTS`,
        SK: `DETAILS-${sentimentId}`,
      }),
      UpdateExpression: 'SET content = :content, updatedAt = :updatedAt',
      ExpressionAttributeValues: marshall({
        ':content': updatedContent,
        ':updatedAt': dateTime,
      }),
    })

    await this.client.send(command)
  }

  async deleteSentiment(sentimentId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: marshall({
        PK: `SENTIMENTS`,
        SK: `DETAILS-${sentimentId}`,
      }),
    })

    await this.client.send(command)
  }
}
