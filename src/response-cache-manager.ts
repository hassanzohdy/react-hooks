import { CachedResponses, ResponseCache } from "./types";

const cachedResponses: CachedResponses = {};

const responseCacheManager = {
  cacheKey(fetcher: any, params: any) {
    return (
      JSON.stringify(fetcher) + JSON.stringify(params) + (params.cacheKey || "")
    );
  },
  canBeCached(params: any) {
    return params.expiresAfter > 0;
  },
  isExpired(cache: ResponseCache) {
    return cache.expiresAt < new Date().getTime();
  },
  set(cacheKey: string, response: any, params: any) {
    cachedResponses[cacheKey] = {
      response,
      expiresAt: new Date().getTime() + params.expiresAfter,
    };
  },
  get(cacheKey: string) {
    const cacheResponse = cachedResponses[cacheKey];

    if (!cacheResponse) return null;

    const isExpired = this.isExpired(cacheResponse);

    if (isExpired) {
      this.delete(cacheKey);
      return null;
    }

    return cacheResponse.response;
  },
  delete(cacheKey: string) {
    delete cachedResponses[cacheKey];
  },
  all() {
    return cachedResponses;
  },
};

export default responseCacheManager;
