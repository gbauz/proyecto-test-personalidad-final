import loadtest from 'loadtest';

const options = {
  url: 'http://localhost:3001/api',
  concurrency: 10,
  requestsPerSecond: 5,
  maxRequests: 100,
};

loadtest.loadTest(options, (error, result) => {
  if (error) {
    console.error('Test failed: ', error);
  } else {
    console.log('Test completed successfully: ', result);
  }
});
