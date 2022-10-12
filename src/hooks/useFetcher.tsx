import { Obj } from "@mongez/reinforcements";
import { useState } from "react";
import { FetcherOptions, FetcherOutput } from "../types";

const defaultOptions: FetcherOptions = {
  defaultParams: {},
  itemsPerPage: 15,
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

/**
 * Advanced hook to fetch data.
 */
export default function useFetcher(
  fetcher: (params: any) => Promise<any>,
  options: FetcherOptions
): FetcherOutput {
  const fetchOptions = { ...currentOptions, ...options };

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
    itemsPerPage: fetchOptions.itemsPerPage,
    keys: fetchOptions.keys,
  }));

  const load = (params: any = {}) => {
    return new Promise((resolve, reject) => {
      fetcher({ ...fetchOptions.defaultParams, ...params })
        .then((response) => {
          setSettings({
            ...settings,
            error: null,
            isLoading: false,
            response,
            records: Obj.get(
              response.data,
              settings.keys.records || "records",
              []
            ),
            totalPages: Obj.get(response.data, settings.keys.totalPages, 0),
            totalRecords: Obj.get(response.data, settings.keys.totalRecords, 0),
            currentRecords: Obj.get(
              response.data,
              settings.keys.currentRecords,
              0
            ),
            itemsPerPage: Obj.get(response.data, settings.keys.itemsPerPage, 0),
            currentPage: Obj.get(response.data, settings.keys.currentPage, 0),
            params: { ...params },
          });
          resolve(response);
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
    records: settings.records,
    error: settings.error,
    response: settings.response,
    loadMore: () => goToPage(settings.currentPage + 1),
    goToPage,
    reset: () => load(fetchOptions.defaultParams),
    params: settings.params,
    defaultParams: fetchOptions.defaultParams!,
  };
}
