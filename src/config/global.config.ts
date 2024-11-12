import * as dotenv from 'dotenv'

dotenv.config()

export const globalConfig = {
  region: "us-east-1",
  dynamoDbTable: "sentiment-analysis-table",
}
