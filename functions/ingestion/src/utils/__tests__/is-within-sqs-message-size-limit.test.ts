import { mockEvent } from '@app/__mocks__';
import isWithinSqsMessageSizeLimit from '../is-within-sqs-message-size-limit';

const withinLimit = new Array(230*1024).join('a')
const overLimit = new Array(258*1024).join('a')

describe('isWithinSqsMessageSizeLimit', () => {
  it('should return true if it is more than min', () => {
    // @ts-ignore
    expect(isWithinSqsMessageSizeLimit({
      ...mockEvent,
      MessageBody: 'a'
    })).toBe(true);
  });
  it('should return true if the message size is less than the max', () => {
    // @ts-ignore
    expect(isWithinSqsMessageSizeLimit({
      ...mockEvent,
      MessageBody: withinLimit,
    })).toBe(true);
  });
  it('should return false if the message size is more than the max', () => {
    // @ts-ignore
    expect(isWithinSqsMessageSizeLimit({
      ...mockEvent,
      MessageBody: overLimit,
    })).toBe(false);
  });
});
