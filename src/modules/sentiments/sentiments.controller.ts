import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common'
import { SentimentsService } from './sentiments.service'
import { SentimentsFilters } from './types/sentiments.type'
import { ListSentimentsDto, SentimentContentDto } from './dtos/sentiments.dto'

@Controller('sentiments')
export class SentimentsController {
  constructor(private readonly sentimentsService: SentimentsService) {}

  @Get()
  async getAll(
    @Query() filters?: SentimentsFilters,
  ): Promise<ListSentimentsDto> {
    try {
      const sentiments = await this.sentimentsService.getAllSentiments(filters)
      return sentiments
    } catch (error) {
      throw new Error(`Error getting all sentiments: ${error.message}`)
    }
  }

  @Get(':id')
  async getById(
    @Param('id') sentimentId: string,
  ): Promise<SentimentContentDto> {
    try {
      const sentiment = await this.sentimentsService.getSentimentById(
        sentimentId,
      )
      return sentiment
    } catch (error) {
      throw new Error(`Error getting sentiment by ID: ${error.message}`)
    }
  }

  @Post()
  async create(@Body() content: SentimentContentDto): Promise<void> {
    try {
      await this.sentimentsService.createSentiment(content)
    } catch (error) {
      throw new Error(`Error creating sentiment: ${error.message}`)
    }
  }

  @Put(':id')
  async update(
    @Param('id') sentimentId: string,
    @Body() updatedContent: SentimentContentDto,
  ): Promise<void> {
    try {
      await this.sentimentsService.updateSentiment(sentimentId, updatedContent)
    } catch (error) {
      throw new Error(`Error updating sentiment: ${error.message}`)
    }
  }

  @Delete(':id')
  async delete(@Param('id') sentimentId: string): Promise<void> {
    try {
      await this.sentimentsService.deleteSentiment(sentimentId)
    } catch (error) {
      throw new Error(`Error deleting sentiment: ${error.message}`)
    }
  }
}
