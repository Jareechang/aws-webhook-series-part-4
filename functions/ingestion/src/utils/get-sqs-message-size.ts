import AWS from 'aws-sdk';

/*
 *
 * Return message size in bytes
 *
 * **/
export default function getSqsMessageSize(
  message: AWS.SQS.Types.SendMessageRequest,
): number {
  const payload : string = typeof message === 'string'
    ? message
    : JSON.stringify(message);
  const buffer = Buffer.from(payload, 'utf8');
  return buffer.byteLength ?? 0;
}
