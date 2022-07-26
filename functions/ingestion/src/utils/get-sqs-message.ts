import AWS from 'aws-sdk';
import {
  APIGatewayProxyEvent,
} from 'aws-lambda';

import config from '@app/config';

export default function getSqsMessage(
  event: APIGatewayProxyEvent,
): AWS.SQS.Types.SendMessageRequest {
  return {
    MessageAttributes: {
      requestId: {
        DataType: 'String',
        StringValue: event?.requestContext?.requestId ?? '',
      }
    },
    MessageBody: event?.body ?? '',
    QueueUrl: config.queue.sqs.url ?? '',
  };
}
