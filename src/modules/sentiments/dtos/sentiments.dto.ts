import { Type } from 'class-transformer'
import { IsDateString, IsNumber, IsObject, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ISentimentContent, ISentimentScore } from '../types/sentiments.type'

export class SentimentScoreDto implements ISentimentScore {
  @ApiProperty({ description: 'Score for positive sentiment', example: 0.9 })
  @IsNumber()
  Positive: number

  @ApiProperty({ description: 'Score for negative sentiment', example: 0.1 })
  @IsNumber()
  Negative: number

  @ApiProperty({ description: 'Score for neutral sentiment', example: 0.0 })
  @IsNumber()
  Neutral: number

  @ApiProperty({ description: 'Score for mixed sentiment', example: 0.0 })
  @IsNumber()
  Mixed: number
}

export class SentimentContentDto implements ISentimentContent {
  @ApiProperty({
    description: 'Text message to be analyzed',
    example: 'I am very happy today!',
  })
  @IsString()
  textMessage: string

  @ApiProperty({ description: 'Overall sentiment result', example: 'Positive' })
  @IsString()
  sentiment: string

  @ApiProperty({
    description: 'Detailed sentiment score',
    type: SentimentScoreDto,
  })
  @IsObject()
  @Type(() => SentimentScoreDto)
  sentimentScore: SentimentScoreDto
}

export class ListSentimentsDto {
  @ApiProperty({
    description: 'List of sentiment items',
    type: [SentimentContentDto],
  })
  items: SentimentContentDto[]

  @ApiProperty({ description: 'Total number of sentiment items', example: 100 })
  total: number
}
