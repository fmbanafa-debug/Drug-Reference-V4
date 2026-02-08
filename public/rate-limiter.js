const RateLimiter = require('async-ratelimiter');

// Configure the rate limiter
const limiter = new RateLimiter({
  tokensPerInterval: 1, // number of tokens per interval
  interval: 'second' // interval duration
});

async function callGoogleGeminiApi() {
  await limiter.removeTokens(1); // consume one token
  // Place your Google Gemini API call code here
  console.log('API call executed');
}

module.exports = callGoogleGeminiApi;