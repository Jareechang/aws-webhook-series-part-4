import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { verifySignature } from '@app/utils';
import { sendMessage } from '@app/services/sqs-service';

// Default starter
export const handler = async(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Event : ', JSON.stringify({
    event,
  }, null, 4));
  // 1. Verify Signature
  verifySignature(event);

  // 2. Add to Queue
  const messageId: string = await sendMessage(event);

  // 3. Error handling (final touch)

  // 4. Response
  return {
    statusCode: 200,
    body: JSON.stringify({
      messageId,
      message: 'success'
    }),
  }
}
