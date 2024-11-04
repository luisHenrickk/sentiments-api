import { Injectable } from '@nestjs/common'
import { SentimentsRepository } from './sentiments.repository'
import { SentimentsFilters } from './types/sentiments.type'
import { ListSentimentsDto, SentimentContentDto } from './dtos/sentiments.dto'
import { unmarshall } from '@aws-sdk/util-dynamodb'

@Injectable()
export class SentimentsService {
  constructor(private readonly sentimentsRepository: SentimentsRepository) {}

  async getAllSentiments(
    filters?: SentimentsFilters,
  ): Promise<ListSentimentsDto> {
    const response = await this.sentimentsRepository.scanTable(filters)
    const items = response.Items.map(item => {
      const unmarshalledItem = unmarshall(item)
      return {
        textMessage: unmarshalledItem.textMessage,
        sentiment: unmarshalledItem.sentiment,
        sentimentScore: {
          Positive: unmarshalledItem.sentimentScore.Positive,
          Negative: unmarshalledItem.sentimentScore.Negative,
          Neutral: unmarshalledItem.sentimentScore.Neutral,
          Mixed: unmarshalledItem.sentimentScore.Mixed,
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
    const item = await this.sentimentsRepository.getSentimentById(sentimentId)
    return item as SentimentContentDto
  }

  async createSentiment(content: SentimentContentDto): Promise<void> {
    await this.sentimentsRepository.saveSentiment(content)
  }

  async updateSentiment(
    sentimentId: string,
    updatedContent: SentimentContentDto,
  ): Promise<void> {
    await this.sentimentsRepository.updateSentiment(sentimentId, updatedContent)
  }

  async deleteSentiment(sentimentId: string): Promise<void> {
    await this.sentimentsRepository.deleteSentiment(sentimentId)
  }
}
