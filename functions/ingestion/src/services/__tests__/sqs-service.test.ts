import { sqs, sendMessage } from '@app/services/sqs-service';
import { mockEvent } from '@app/__mocks__';

jest.mock('aws-sdk', () => {
  const SqsMethods = {
    sendMessage: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  }
  const mockAwsSdk = {
    SQS: jest.fn(() => SqsMethods),
  };
  return mockAwsSdk;
});

describe('sqs-service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('sendMessage', () => {
    it('should return the SQS MessageId upon success', () => {
      const messageBody = 'test message';
      const messageId = 'test';
      (sqs.sendMessage as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          MessageId: messageId
        }),
      })
      // @ts-ignore
      expect(sendMessage({
        ...mockEvent,
        body: messageBody
      })).resolves.toBe(messageId)
    });
    it('should make a request to SQS with the correct message body', async() => {
      const messageBody = 'test message';
      const messageId = 'test';
      (sqs.sendMessage as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          MessageId: messageId
        }),
      })
      // @ts-ignore
      await sendMessage({
        ...mockEvent,
        body: messageBody
      });
      expect(sqs.sendMessage).toBeCalledWith({
        MessageAttributes: {
          requestId: {
            DataType: 'String',
            StringValue: mockEvent?.requestContext?.requestId
          }
        },
        MessageBody: messageBody,
        QueueUrl: ''
      });
    });
    it('should default to empty string if no message id is found', () => {
      (sqs.sendMessage as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      })
      // @ts-ignore
      expect(sendMessage({
        ...mockEvent,
        body: 'test'
      })).resolves.toBe('')
    });
    it('should throw AwsSqsServiceError if service call fails', async() => {
      const mockError = new Error('mockError');
      (sqs.sendMessage as jest.Mock).mockReturnValue({
        promise: () => { throw mockError },
      })
      try {
        // @ts-ignore
        await sendMessage({
          ...mockEvent,
          body: 'test'
        })
      } catch (error: any) {
        expect(error.name).toBe('AwsSqsServiceError');
        expect(error.message).toBe('failed to sendMessage');
        expect(error.operation).toBe('services/sqs-service:sendMessage');
        expect(error.context).toEqual({
          error: mockError,
          message: {
            MessageAttributes: {
              requestId: {
                DataType: 'String',
                StringValue: "Vb4i_hboIAMEVMA=",
              }
            },
            MessageBody: 'test',
            QueueUrl: '',
          },
        });
      }
    });
    it('should throw AwsSqsSizeLimitError if service call fails', async() => {
      (sqs.sendMessage as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue(null),
      })
      try {
        // @ts-ignore
        await sendMessage({
          ...mockEvent,
          body: new Array(257 * 1024).join('a'),
        });
      } catch (error: any) {
        expect(error.name).toBe('AwsSqsSizeLimitError');
        expect(error.message).toBe('exceeds sqs message limit');
        expect(error.operation).toBe('services/sqs-service:sendMessage');
        expect(error.context.size).toBeDefined();
      }
    });
  });
});
