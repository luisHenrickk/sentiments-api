import * as dotenv from 'dotenv'

dotenv.config()

export const globalConfig = {
  region: process.env.REGION,
  dynamoDbTable: process.env.DYNAMODB_TABLE,
}
