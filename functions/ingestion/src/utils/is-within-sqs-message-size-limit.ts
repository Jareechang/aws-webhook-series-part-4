import AWS from 'aws-sdk';
import config from '@app/config';
import { getSqsMessageSize } from '@app/utils';

/*
 *
 * Check if SQS message is within size limits
 *
 * **/
export default function isWithinSqsMessageSizeLimit(
  message: AWS.SQS.Types.SendMessageRequest,
): boolean {
  const max : number = config.queue.sqs.sizeLimit.max ?? 256 * 1024;
  const min : number = config.queue.sqs.sizeLimit.min ?? 1;
  const size = getSqsMessageSize(message);
  // Check size is above min
  if (size < min) return false;
  // Check size is less than max
  return size < max;
}
