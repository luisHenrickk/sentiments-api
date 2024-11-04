import { EventBody } from 'common/types/event-body'

export const parseBody = (body: string | Record<string, string>): EventBody => {
  return (typeof body === 'string' ? JSON.parse(body) : body) as EventBody
}
