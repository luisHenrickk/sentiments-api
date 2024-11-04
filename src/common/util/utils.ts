export const lambdaResponse = (
  data: any,
  code: number,
  toApiGateway?: boolean,
) => {
  const payload = {
    statusCode: code,
    body: JSON.stringify(data),
  }

  if (toApiGateway && !String(code).startsWith('2')) {
    throw new Error(JSON.stringify(payload))
  }

  return payload
}
