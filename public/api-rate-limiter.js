// api-rate-limiter.js

class RateLimiter {
    constructor(maxRequests, interval) {
        this.maxRequests = maxRequests;
        this.interval = interval;
        this.requests = 0;
        this.queue = [];
        this.resetTime = Date.now() + interval;
    }

    allowRequest() {
        if (this.requests < this.maxRequests) {
            this.requests++;
            return true;
        }
        return false;
    }

    addToQueue(request) {
        this.queue.push(request);
    }

    processQueue() {
        while (this.allowRequest() && this.queue.length > 0) {
            const request = this.queue.shift();
            request();
        }
    }

    reset() {
        if (Date.now() > this.resetTime) {
            this.requests = 0;
            this.resetTime = Date.now() + this.interval;
            this.processQueue();
        }
    }
}

const rateLimiter = new RateLimiter(5, 1000); // Max 5 requests per second

async function makeGeminiAPICall() {
    // Your Google Gemini API call logic here
}

async function limitedGeminiAPICall() {
    return new Promise((resolve, reject) => {
        if (rateLimiter.allowRequest()) {
            makeGeminiAPICall()
                .then(resolve)
                .catch(err => {
                    rateLimiter.addToQueue(() => limitedGeminiAPICall().then(resolve).catch(reject));
                });
        } else {
            rateLimiter.addToQueue(() => limitedGeminiAPICall().then(resolve).catch(reject));
        }
    });
}

// Example usage:
limitedGeminiAPICall().then(response => {
    console.log('API response:', response);
}).catch(err => {
    console.error('API error:', err);
});
