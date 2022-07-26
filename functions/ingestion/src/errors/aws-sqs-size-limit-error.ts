import CommonError from './common-error';

class AwsSqsSizeLimitError extends CommonError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export default AwsSqsSizeLimitError;
