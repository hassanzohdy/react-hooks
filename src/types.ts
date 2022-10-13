import { AxiosResponse } from "axios";

export type FetcherOptions = {
  defaultParams?: Record<string, any>;
  itemsPerPage?: number;
  // the keys that will be taken from the `response.data` object and will be used as the output
  // it supports dot notation like `paginationInfo.currentPage` or `meta.totalRecords`
  keys?: {
    records?: string;
    itemsPerPage?: string;
    currentPage?: string;
    totalPages?: string;
    totalRecords?: string;
    currentRecords?: string;
    pageNumber?: string;
  };
};

export type FetcherOutput = {
  records: any[];
  error: null | any;
  load: (params?: Record<string, any>) => Promise<any>;
  reload: (params?: Record<string, any>) => Promise<any>;
  isLoading: boolean;
  loadMore: (params?: Record<string, any>) => Promise<any>;
  goToPage: (page: number) => Promise<any>;
  reset: () => Promise<any>;
  isLastPage: boolean;
  isFirstPage: boolean;
  currentPage: number;
  response?: AxiosResponse;
  totalPages: number;
  totalRecords: number;
  currentRecords: number;
  defaultParams: Record<string, any>;
  params: Record<string, any>;
  paginatable: boolean;
};
