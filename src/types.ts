interface Response {
  data: any;
  status: string;
  message: string;
  error: Error | null | string;
}

export interface ResponseWithCallback {
  callback: any;
  status: string;
  message?: string;
  unSubscribe?: () => any;
  error: Error | null | string;
}

export interface IConnection {
  storage: any;
  firestore: any;
}

export interface FilterOptionsParam {
  startIndex: number;
  orderByField: string;
  paginationLimit: number;
}

export interface SubCollectionPayload<T> {
  data: T;
  docId: any;
  subColDocId: any;
  subCollection: string;
}

export interface PaginationParams {
  type: string;
  field: string;
  endIndex: number;
  startIndex: number;
}

export type DocId = number | string;
export type CallBackFunc = (snapshot: any) => void;

export interface FilterOptions {
  type: string;
  field: string;
}

export default Response;
