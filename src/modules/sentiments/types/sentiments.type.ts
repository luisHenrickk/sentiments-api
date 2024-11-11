import { UUID } from 'crypto'

export interface ISentimentScore {
  Positive: number
  Negative: number
  Neutral: number
  Mixed: number
}

export interface ISentimentContent {
  sentimentId: UUID
  textMessage: string
  sentiment: string
  sentimentScore: ISentimentScore
}

export interface SentimentKey {
  PK: string
  SK: string
}

export type SentimentsFilters = {
  sentiment?: string
}
