// api-cache-manager.js

class ApiCacheManager {
    constructor(ttl) {
        this.cache = {};
        this.ttl = ttl;
    }

    set(key, value) {
        const expiry = new Date().getTime() + this.ttl;
        this.cache[key] = { value, expiry };
        localStorage.setItem(key, JSON.stringify(this.cache[key]));
    }

    get(key) {
        const cachedData = JSON.parse(localStorage.getItem(key));
        if (!cachedData) return null;

        const now = new Date().getTime();
        if (now > cachedData.expiry) {
            this.clear(key);
            return null;
        }
        return cachedData.value;
    }

    clear(key) {
        delete this.cache[key];
        localStorage.removeItem(key);
    }

    clearAll() {
        this.cache = {};
        localStorage.clear();
    }
}

// Example usage:
// const apiCache = new ApiCacheManager(60000); // 1 minute TTL
// apiCache.set('apiData', data);
// const data = apiCache.get('apiData');
// apiCache.clear('apiData');
// apiCache.clearAll();
