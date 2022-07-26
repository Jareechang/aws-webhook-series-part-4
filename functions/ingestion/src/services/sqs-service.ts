import AWS from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  getSqsMessage,
  getSqsMessageSize,
  isWithinSqsMessageSizeLimit,
} from '@app/utils';
import config from '@app/config';
import {
  AwsSqsServiceError,
  AwsSqsSizeLimitError
} from '@app/errors';

export const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  region: config.queue.sqs.defaultRegion,
});

/*
 * Check message size to determine if it is within limit otherwise throw error
 *
 * **/

export function checkMessageSize(
  message: AWS.SQS.Types.SendMessageRequest
): void {
  if (!isWithinSqsMessageSizeLimit(message)) {
    throw new AwsSqsSizeLimitError('exceeds sqs message limit')
      .setOperation('services/sqs-service:sendMessage')
      .setContext({
        size: getSqsMessageSize(message),
      });
  }
}

/*
 * adds an event message to the queue
 *
 * **/
export async function sendMessage(
  event: APIGatewayProxyEvent
): Promise<string> {
  const message: AWS.SQS.Types.SendMessageRequest = getSqsMessage(event);
  checkMessageSize(message);
  try {
    const result: AWS.SQS.Types.SendMessageResult = (
      await sqs.sendMessage(message).promise());
    return result?.MessageId ?? '';
  } catch (error) {
    throw new AwsSqsServiceError('failed to sendMessage')
      .setOperation('services/sqs-service:sendMessage')
      .setContext({
        error,
        message,
      });
  }
}
