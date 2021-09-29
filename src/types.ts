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
  firestore: any;
  storage: any;
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

export default Response;
