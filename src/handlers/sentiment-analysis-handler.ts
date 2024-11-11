import {
  ComprehendClient,
  DetectSentimentCommand,
} from '@aws-sdk/client-comprehend'
import { HttpStatus } from '@nestjs/common'
import { SentimentsRepository } from '../modules/sentiments/sentiments.repository'
import { DynamoClientService } from '../modules/database/dynamodb-client.service'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'crypto'

const dynamoClientService = new DynamoClientService()
const sentimentsRepository = new SentimentsRepository(dynamoClientService)

const comprehendClient = new ComprehendClient({
  region: process.env.REGION,
})

export const execute = async event => {
  try {
    const eventBody = JSON.parse(event.body)

    if (!eventBody?.textMessage) {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        body: JSON.stringify({ eventBody }),
      }
    }

    const sentimentResult = await comprehendClient.send(
      new DetectSentimentCommand({
        Text: eventBody.textMessage,
        LanguageCode: 'pt',
      }),
    )

    const sentimentScore = {
      Positive: sentimentResult.SentimentScore?.Positive ?? 0,
      Negative: sentimentResult.SentimentScore?.Negative ?? 0,
      Neutral: sentimentResult.SentimentScore?.Neutral ?? 0,
      Mixed: sentimentResult.SentimentScore?.Mixed ?? 0,
    }

    const content = {
      sentimentId: randomUUID(),
      textMessage: eventBody.textMessage,
      sentiment: sentimentResult.Sentiment,
      sentimentScore,
    }

    await sentimentsRepository.saveSentiment(content)

    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify({
        message: 'Sentiment successfully saved',
        content,
      }),
    }
  } catch (error) {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: error.message, stack: error.stack }),
    }
  }
}
