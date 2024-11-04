export interface ISentimentScore {
  Positive: number
  Negative: number
  Neutral: number
  Mixed: number
}

export interface ISentimentContent {
  textMessage: string
  sentiment: string
  sentimentScore: {
    Positive: number
    Negative: number
    Neutral: number
    Mixed: number
  }
}

export interface SentimentKey {
  PK: string
  SK: string
}

export type SentimentsFilters = {
  sentiment?: string
}
