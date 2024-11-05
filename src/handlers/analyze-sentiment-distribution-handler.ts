import { HttpStatus } from '@nestjs/common'
import { SentimentsRepository } from '../modules/sentiments/sentiments.repository'
import { DynamoClientService } from '../modules/database/dynamodb-client.service'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const dynamoClientService = new DynamoClientService()
const sentimentsRepository = new SentimentsRepository(dynamoClientService)

export const execute = async event => {
  try {
    const response = await sentimentsRepository.scanTable()

    if (!response.Items || response.Items.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No data found in the table' }),
      }
    }

    // Unmarshall items and calculate statistics
    const sentiments = response.Items.map(item => unmarshall(item))
    const totalItems = sentiments.length
    const sentimentCounts = { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0, MIXED: 0 }

    sentiments.forEach(sentiment => {
      const sentimentType = sentiment.content.sentiment
      if (sentimentCounts[sentimentType] !== undefined) {
        sentimentCounts[sentimentType]++
      }
    })

    // Calculate the percentage distribution of each sentiment type
    const sentimentDistribution = Object.keys(sentimentCounts).reduce(
      (acc, key) => {
        acc[key] = ((sentimentCounts[key] / totalItems) * 100).toFixed(2) + '%'
        return acc
      },
      {} as Record<string, string>,
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalItems,
        sentimentDistribution,
      }),
    }
  } catch (error) {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: error.message, stack: error.stack }),
    }
  }
}
