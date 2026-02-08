// gemini-api-manager.js

class ApiRateLimiter {
    constructor() {
        this.requests = {};
        this.cache = {};
        this.dailyLimits = {};
        this.dailyLimitAmount = 1000; // Example limit
    }

    async request(key, apiCall) {
        const currentDate = new Date().toISOString().split('T')[0];
        this.initializeDailyLimit(key, currentDate);

        if (this.isLimitReached(key, currentDate)) {
            return this.queueRequest(key, apiCall);
        }

        return this.executeApiCall(key, apiCall);
    }

    initializeDailyLimit(key, date) {
        if (!this.dailyLimits[key]) {
            this.dailyLimits[key] = {};
        }
        if (!this.dailyLimits[key][date]) {
            this.dailyLimits[key][date] = 0;
        }
    }

    isLimitReached(key, date) {
        return this.dailyLimits[key][date] >= this.dailyLimitAmount;
    }

    queueRequest(key, apiCall) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.executeApiCall(key, apiCall).then(resolve);
            }, this.calculateBackoff(key));
        });
    }

    calculateBackoff(key) {
        const now = new Date();
        const backoffTime = Math.pow(2, this.requests[key] || 0) * 1000; // Exponential backoff
        this.requests[key] = (this.requests[key] || 0) + 1;
        return backoffTime;
    }

    async executeApiCall(key, apiCall) {
        try {
            this.dailyLimits[key][new Date().toISOString().split('T')[0]]++;
            // Simulate API call
            const response = await apiCall();
            this.cache[key] = response;
            return response;
        } catch (error) {
            console.error(`Error making API call for key ${key}:`, error);
            return null; // Handle as necessary
        }
    }
}

module.exports = ApiRateLimiter;
