import { Injectable } from '@nestjs/common'
import { SentimentsRepository } from './sentiments.repository'
import { SentimentsFilters } from './types/sentiments.type'
import {
  ListSentimentsDto,
  SentimentContentDto,
  UpdateSentimentContentDto,
} from './dtos/sentiments.dto'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import {
  ComprehendClient,
  DetectSentimentCommand,
} from '@aws-sdk/client-comprehend'
import { randomUUID } from 'crypto'

@Injectable()
export class SentimentsService {
  private comprehendClient: ComprehendClient;
  constructor(
    private readonly sentimentsRepository: SentimentsRepository,
    
  ) {
    
    this.comprehendClient = new ComprehendClient({
      region: "us-east-1",
    });
  }

  async getAllSentiments(
    filters?: SentimentsFilters,
  ): Promise<ListSentimentsDto> {
    const response = await this.sentimentsRepository.scanTable(filters)
    const items = response.Items.map(item => {
      const unmarshalledItem = unmarshall(item)
      return {
        textMessage: unmarshalledItem.textMessage,
        sentiment: unmarshalledItem.content.sentiment,
        sentimentId: unmarshalledItem.content.sentimentId,
        sentimentScore: {
          Positive: unmarshalledItem.content.sentimentScore.Positive,
          Negative: unmarshalledItem.content.sentimentScore.Negative,
          Neutral: unmarshalledItem.content.sentimentScore.Neutral,
          Mixed: unmarshalledItem.content.sentimentScore.Mixed,
        },
        createdAt: unmarshalledItem.createdAt,
        updatedAt: unmarshalledItem.updatedAt,
      } as SentimentContentDto
    })

    return {
      items,
      total: response.Count || 0,
    }
  }

  async getSentimentById(sentimentId: string): Promise<SentimentContentDto> {
    const sentiment = await this.sentimentsRepository.getSentimentById(
      sentimentId,
    )

    return sentiment
  }

  async createSentiment(message: string): Promise<void> {
    const sentimentResult = await this.comprehendClient.send(
      new DetectSentimentCommand({
        Text: message,
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
      textMessage: message,
      sentiment: sentimentResult.Sentiment,
      sentimentScore,
    }

    await this.sentimentsRepository.saveSentiment(content)
  }

  async updateSentiment(
    sentimentId: string,
    updatedContent: UpdateSentimentContentDto,
  ): Promise<void> {
    await this.sentimentsRepository.updateSentiment(sentimentId, updatedContent)
  }

  async deleteSentiment(sentimentId: string): Promise<void> {
    await this.sentimentsRepository.deleteSentiment(sentimentId)
  }
}
