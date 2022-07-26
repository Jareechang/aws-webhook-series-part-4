# Step-By-Step Guide to integrate a webhook with Github using AWS 

This is the part 4 of the technical series, it is available [here](https://www.jerrychang.ca/writing/step-by-step-guide-to-integrate-a-webhook-with-github-using-aws).

<img src="https://www.jerrychang.ca/images/og-webhook-step-by-step-guide-to-integrate-a-webhook-with-github-using-aws.png" alt="Step-by-step guide to integrate a webhook with Github using AWS" style="width:100%">

**By the end of this module, you should:**

- ✅ Be able to integrate AWS API gateway and SQS and AWS Lambda

- ✅ Know how to structure and how to write tests for lambda function uses AWS services

- ✅ Understand the code required to make our Ingest function work (verifySignature + SQS.sendMessage)

- ✅ Understand the constraints of SQS message size (ie size limit) and know how to guard against it

- ✅ Understand how to setup webhooks with Github

Feel free to use this starter template - [aws-webhook-series-part-3](https://github.com/Jareechang/aws-webhook-series-part-3) as a starting point.
