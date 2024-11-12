import { Injectable, NotFoundException } from '@nestjs/common'
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
import {
  SentimentContentDto,
  UpdateSentimentContentDto,
} from './dtos/sentiments.dto'
import { NotFoundError } from 'rxjs'
import { JobNotFoundException } from '@aws-sdk/client-comprehend'

@Injectable()
export class SentimentsRepository {
  constructor(private readonly client: DynamoClientService) {}

  async scanTable(filters?: SentimentsFilters): Promise<ScanCommandOutput> {
    let params: any = {
      TableName: "sentiment-analysis-table",
    }

    const filterExpressions = []
    const expressionAttributeValues: any = {}

    if (filters?.sentiment) {
      filterExpressions.push('content.#sentiment = :sentiment')
      expressionAttributeValues[':sentiment'] = filters.sentiment
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ')
      params.ExpressionAttributeNames = {
        '#sentiment': 'sentiment',
      }
      params.ExpressionAttributeValues = marshall(expressionAttributeValues)
    }

    const command = new ScanCommand(params)
    return this.client.send(command)
  }

  async saveSentiment(content: SentimentContentDto): Promise<void> {
    const dateTime = new Date().toISOString()

    const { sentimentId } = content

    const command = new PutItemCommand({
      TableName: "sentiment-analysis-table",
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
      TableName: "sentiment-analysis-table",
      Key: marshall({
        PK: `SENTIMENTS`,
        SK: `DETAILS-${sentimentId}`,
      }),
    })

    const response = await this.client.send(command)
    if (!response.Item) {
      throw new NotFoundException('Sentiment not found')
    }

    const item = unmarshall(response.Item)

    const sentimentContent: SentimentContentDto = {
      sentimentId: item.content.sentimentId,
      textMessage: item.textMessage,
      sentiment: item.content.sentiment,
      sentimentScore: item.content.sentimentScore,
    }

    return sentimentContent
  }

  async updateSentiment(
    sentimentId: string,
    updatedContent: UpdateSentimentContentDto,
  ): Promise<void> {
    const dateTime = new Date().toISOString()

    const updateExpressions: string[] = []
    const expressionAttributeValues: Record<string, any> = {}

    if (updatedContent.textMessage) {
      updateExpressions.push('content.textMessage = :textMessage')
      expressionAttributeValues[':textMessage'] = updatedContent.textMessage
    }

    if (updatedContent.sentiment) {
      updateExpressions.push('content.sentiment = :sentiment')
      expressionAttributeValues[':sentiment'] = updatedContent.sentiment
    }

    if (updatedContent.sentimentScore) {
      updateExpressions.push('content.sentimentScore = :sentimentScore')
      expressionAttributeValues[':sentimentScore'] =
        updatedContent.sentimentScore
    }

    updateExpressions.push('updatedAt = :updatedAt')
    expressionAttributeValues[':updatedAt'] = dateTime

    const updateExpression = 'SET ' + updateExpressions.join(', ')

    const command = new UpdateItemCommand({
      TableName: "sentiment-analysis-table",
      Key: marshall({
        PK: `SENTIMENTS`,
        SK: `DETAILS-${sentimentId}`,
      }),
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
    })

    await this.client.send(command)
  }

  async deleteSentiment(sentimentId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: "sentiment-analysis-table",
      Key: marshall({
        PK: `SENTIMENTS`,
        SK: `DETAILS-${sentimentId}`,
      }),
    })

    await this.client.send(command)
  }
}
