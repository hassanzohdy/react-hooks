import { Obj } from "@mongez/reinforcements";
import { useEffect, useState } from "react";
import responseCacheManager from "../response-cache-manager";
import { FetcherOptions, FetcherOutput } from "../types";

const defaultOptions: FetcherOptions = {
  defaultParams: {},
  expiresAfter: 60 * 5000, // 5 minutes
  keys: {
    records: "records",
    itemsPerPage: "paginationInfo.itemsPerPage",
    currentPage: "paginationInfo.currentPage",
    currentRecords: "paginationInfo.currentRecords",
    totalPages: "paginationInfo.totalPages",
    totalRecords: "paginationInfo.totalRecords",
    pageNumber: "page",
  },
};

let currentOptions: FetcherOptions = { ...defaultOptions };

export function setFetchOptions(options: Partial<FetcherOptions> = {}) {
  currentOptions = { ...currentOptions, ...options };
}

export function getFetchOptions() {
  return currentOptions;
}

/**
 * Advanced hook to fetch data.
 */
export default function useFetcher(
  fetcher: (params: any) => Promise<any>,
  options: FetcherOptions = {}
): FetcherOutput {
  const fetchOptions = Obj.merge(currentOptions, options);

  const canBeCached = responseCacheManager.canBeCached(fetchOptions);

  const [settings, setSettings] = useState<FetcherOutput>(() => ({
    records: [],
    error: null,
    isLoading: true,
    currentPage: 1,
    totalPages: 0,
    totalRecords: 0,
    currentRecords: 0,
    defaultParams: fetchOptions.defaultParams || {},
    params: fetchOptions.defaultParams || {},
    keys: fetchOptions.keys,
  }));

  const updateSettings = (response: any, params: any) => {
    const responseData = response.data;

    setSettings({
      ...settings,
      error: null,
      isLoading: false,
      response,
      records: Obj.get(responseData, settings.keys.records || "records", []),
      totalPages: Obj.get(responseData, settings.keys.totalPages, 0),
      totalRecords: Obj.get(responseData, settings.keys.totalRecords, 0),
      currentRecords: Obj.get(responseData, settings.keys.currentRecords, 0),
      itemsPerPage: Obj.get(responseData, settings.keys.itemsPerPage, 0),
      currentPage: Obj.get(responseData, settings.keys.currentPage, 0),
      params: params,
    });
  };

  const load = (params: any = {}) => {
    return new Promise((reject) => {
      const fetcherParams = { ...fetchOptions.defaultParams, ...params };
      let cacheKey: string = "";

      if (canBeCached) {
        cacheKey = responseCacheManager.cacheKey(fetcher, fetcherParams);

        const response = responseCacheManager.get(cacheKey);

        if (response) {
          return updateSettings(response, fetcherParams);
        }
      }

      fetcher({ ...fetchOptions.defaultParams, ...params })
        .then((response) => {
          updateSettings(response, fetcherParams);

          if (canBeCached) {
            responseCacheManager.set(cacheKey, response, fetcherParams);
          }
        })
        .catch((error) => {
          setSettings({
            ...settings,
            error,
            response: error?.response,
            isLoading: false,
          });
          reject(error);
        });
    });
  };

  useEffect(() => {
    load();
  }, []);

  const goToPage = (pageNumber: number) => {
    return load({
      [fetchOptions.keys?.pageNumber!]: pageNumber,
      ...settings.params,
    });
  };

  return {
    load,
    reload: () => load(settings.params),
    currentPage: settings.currentPage,
    totalPages: settings.totalPages,
    totalRecords: settings.totalRecords,
    currentRecords: settings.currentRecords,
    isLoading: settings.isLoading,
    isLastPage: settings.currentPage === settings.totalPages,
    isFirstPage: settings.currentPage === 1,
    records: settings.records,
    error: settings.error,
    response: settings.response,
    loadMore: () => goToPage(settings.currentPage + 1),
    goToPage,
    reset: () => load(fetchOptions.defaultParams),
    params: settings.params,
    defaultParams: fetchOptions.defaultParams!,
    paginatable: settings.totalPages > 1,
  };
}
