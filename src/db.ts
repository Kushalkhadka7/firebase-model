import * as message from './message';
import Response, { FilterOptionsParam, IConnection, ResponseWithCallback, SubCollectionPayload } from './types';
import { errorResponse, successResponse, notFoundResponse, snapShotResponse, snapShotErrorResponse } from './util';

/**
 * Fetch all documents in a collection.
 *
 * @param {IConnection} connection
 * @param {string} collection
 *
 * @returns {Promise<Response>}
 */
export async function fetchAll<T>(connection: IConnection, collection: string): Promise<Response> {
  try {
    const result = await connection.firestore.collection(collection).get();

    const response = result.docs.map((element: any) => element.data());

    if (!response) {
      return notFoundResponse(message.FETCH_ALL_DOCUMENTS_ERROR);
    }

    return successResponse<T>(result, message.FETCH_ALL_DOCUMENTS_SUCCESS);
  } catch (error) {
    return errorResponse(error as Error, message.FETCH_ALL_DOCUMENTS_ERROR);
  }
}

/**
 * Get document by its document id.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 *
 * @returns {Promise<Response>}
 */
export async function findDocumentById<T>(connection: IConnection, collection: string, docId: any): Promise<Response> {
  try {
    const data = await connection.firestore.collection(collection).doc(docId);
    const result = await data.get();

    if (!result) {
      return notFoundResponse(message.DOCUMENT_NOT_FOUND);
    }

    return successResponse<T>(result.data() || result._data, message.FETCH_DOCUMENT_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.FETCH_DOCUMENT_ERROR);
  }
}

/**
 * Get document by in a sub collection by its id.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 * @param {string} subCollection
 * @param {any} subColId
 *
 * @returns {Promise<Response>}
 */
export async function getSubCollectionDocById<T>(
  connection: IConnection,
  collection: string,
  docId: any,
  subCollection: string,
  subColId: any
): Promise<Response> {
  const data = await connection.firestore.collection(collection).doc(docId).collection(subCollection).doc(subColId);
  const result = await data.get();

  if (!result) {
    return notFoundResponse(message.FETCH_DOCUMENT_ERROR);
  }

  return successResponse<T>(result.data() || result._data, message.FETCH_DOCUMENT_SUCCESS);
}

/**
 * Get document snapShot by id.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 * @param {Function} callback
 *
 * @returns {Object}
 */
export async function findDocumentSnapShotById(
  connection: IConnection,
  collection: string,
  docId: any,
  callback: Function
): Promise<ResponseWithCallback> {
  const unSubscriber = await connection.firestore.collection(collection).doc(docId).onSnapshot(callback);

  if (!unSubscriber) {
    return snapShotErrorResponse(new Error(), message.FETCH_DOCUMENT_ERROR);
  }

  return snapShotResponse(unSubscriber, message.FETCH_DOCUMENT_SUCCESS);
}

/**
 * Save document to a collection.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 * @param {T} payload
 *
 * @returns {Promise<Response>}
 */
export async function save<T>(connection: IConnection, collection: string, docId: any, payload: T): Promise<Response> {
  try {
    await connection.firestore.collection(collection).doc(docId).set(payload);

    return successResponse<T>(payload, message.SAVE_DOCUMENT_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.SAVE_DOCUMENT_ERROR);
  }
}

/**
 * Update document by document id.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 * @param {object} payload
 *
 * @returns {Promise<Response>}
 */
export async function updateDocumentById<T>(
  connection: IConnection,
  collection: string,
  docId: any,
  payload: T
): Promise<Response> {
  try {
    await connection.firestore.collection(collection).doc(docId).update(payload);

    return successResponse<T>(payload, message.UPDATE_DOCUMENT_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.UPDATE_DOCUMENT_ERROR);
  }
}

/**
 * Update document by id and fetch the latest changes and return the payload.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 * @param {T} payload
 *
 * @returns {Promise<Response>}
 */
export async function updateDocumentByIdWithPayload<T>(
  connection: IConnection,
  collection: string,
  docId: any,
  payload: T
): Promise<Response> {
  try {
    await connection.firestore.collection(collection).doc(docId).update(payload);

    const updatedDoc = await findDocumentById(connection, collection, docId);

    return successResponse({ ...updatedDoc.data }, message.UPDATE_DOCUMENT_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.UPDATE_DOCUMENT_ERROR);
  }
}

/**
 * Fetch document with pagination. [TODO]
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {FilterOptionsParam} filterOptions
 *
 * @returns {Promise<Response>}
 */
export async function fetchDataWithPagination<T>(
  connection: IConnection,
  collection: string,
  filterOptions: FilterOptionsParam
): Promise<Response> {
  console.log('payload', filterOptions);
  const { startIndex = 0, paginationLimit, orderByField = 'name' } = filterOptions;

  const result = await connection.firestore
    .collection(collection)
    .orderBy(orderByField)
    .startAt(startIndex)
    .limit(paginationLimit)
    .get();

  let response: T[] = [];
  result.forEach((element: any) => {
    response.push(element.doc());
  });

  if (!result) {
    return notFoundResponse(message.DOCUMENT_NOT_FOUND);
  }

  return successResponse<T>(response, message.FETCH_DOCUMENT_SUCCESS);
}

/**
 * Fetch document with pagination.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 * @param {string} subCollection
 * @param {object} filterOptions
 *
 * @returns {Promise<Response>}
 */
export async function fetchSubColDataWithPagination<T>(
  connection: IConnection,
  collection: string,
  docId: any,
  subCollection: string,
  filterOptions?: any
): Promise<Response> {
  const { field, type, paginationLimit } = filterOptions;

  const result = await connection.firestore
    .collection(collection)
    .doc(docId)
    .collection(subCollection)
    .orderBy(field, type)
    .limit(paginationLimit)
    .get();

  if (!result) {
    return notFoundResponse(message.DOCUMENT_NOT_FOUND);
  }

  return successResponse<T>(result, message.FETCH_DOCUMENT_SUCCESS);
}

/**
 * Fetch data from subCollection. [TODO]
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 * @param {String} subCollection
 * @param {Object} filterOptions
 *
 * @returns {Promise<Response>}
 */
export async function getSubCollectionData<T>(
  connection: IConnection,
  collection: string,
  docId: any,
  subCollection: string,
  filterOptions?: any
): Promise<Response> {
  try {
    let result;

    if (filterOptions) {
      const { field, type } = filterOptions;

      result = await connection.firestore
        .collection(collection)
        .doc(docId)
        .collection(subCollection)
        .orderBy(field, type)
        .get();
    } else {
      result = await connection.firestore.collection(collection).doc(docId).collection(subCollection).get();
    }

    console.log('result', result.docs.data());

    if (!result) {
      return notFoundResponse(message.DOCUMENT_NOT_FOUND);
    }

    return successResponse<T>(result, message.FETCH_SUB_COLLECTION_DOC_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.FETCH_SUB_COLLECTION_DOC_ERROR);
  }
}

/**
 * Add data to a sub collection.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {SubCollectionPayload<T>} payload
 *
 * @returns {Promise<Response>}
 */
export async function addDataToSubCollection<T>(
  connection: IConnection,
  collection: string,
  payload: SubCollectionPayload<T>
): Promise<Response> {
  const { docId, subCollection, subColDocId, data } = payload;

  try {
    await connection.firestore
      .collection(collection)
      .doc(docId)
      .collection(subCollection)
      .doc(subColDocId)
      .set({ ...data }, { merge: true });

    return successResponse<SubCollectionPayload<T>>(payload, message.ADD_DATA_TO_SUB_COL_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.ADD_DATA_TO_SUB_COL_ERROR);
  }
}

/**
 * Update sub collection documents identified by subColDocId.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {SubCollectionPayload<T>} payload
 *
 * @returns {Promise<Response>}
 */
export async function updateSubCollectionDoc<T>(
  connection: IConnection,
  collection: string,
  payload: SubCollectionPayload<T>
): Promise<Response> {
  const { docId, subCollection, subColDocId, data } = payload;

  try {
    await connection.firestore
      .collection(collection)
      .doc(docId)
      .collection(subCollection)
      .doc(subColDocId)
      .update(data);

    return successResponse(payload, message.UPDATE_SUB_COL_DOC_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.UPDATE_SUB_COL_DOC_ERROR);
  }
}

/**
 * Update sub collection document identified by subColDocId and returns the updated payload.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {SubCollectionPayload<T>} payload
 *
 * @returns {Promise<Response>}
 */
export async function updateSubCollectionWithPayload<T>(
  connection: IConnection,
  collection: string,
  payload: SubCollectionPayload<T>
): Promise<Response> {
  const { docId, subCollection, subColDocId, data } = payload;

  try {
    await connection.firestore
      .collection(collection)
      .doc(docId)
      .collection(subCollection)
      .doc(subColDocId)
      .update(data);

    const updatedDoc = await getSubCollectionDocById(connection, collection, docId, subCollection, subColDocId);

    return successResponse({ ...updatedDoc.data }, message.UPDATE_SUB_COL_DOC_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.UPDATE_SUB_COL_DOC_ERROR);
  }
}

/**
 * Delete collection doc identified by id. [TODO]
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 *
 * @returns {Promise<Response>}
 */
export async function deleteCollectionDocById<T>(
  connection: IConnection,
  collection: string,
  docId: any
): Promise<Response> {
  try {
    await connection.firestore.collection(collection).doc(docId).delete();

    const response = {
      documentId: docId,
    };

    return successResponse<T | { documentId: any }>(response, message.DELETE_COLLECTION_DOC_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.DELETE_COLLECTION_DOC_ERROR);
  }
}

/**
 * Delete sub collection doc identified by it subColDocId.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 * @param {string} subCol
 * @param {any} subColDocId
 *
 * @returns {Promise<Response>}
 */
export async function deleteSubColDocById<T>(
  connection: IConnection,
  collection: string,
  docId: any,
  subCol: string,
  subColDocId: any
): Promise<Response> {
  const subCollectionDoc = await getSubCollectionDocById(connection, collection, docId, subCol, subColDocId);

  if (!subCollectionDoc.data) {
    return notFoundResponse(message.SUB_COLLECTION_DOC_NOT_FOUND);
  }

  try {
    const data = await connection.firestore
      .collection(collection)
      .doc(docId)
      .collection(subCol)
      .doc(subColDocId)
      .delete();

    console.log('data', data);

    const response = {
      documentId: docId,
      subColDocId: subColDocId,
      subCollection: subCol,
    };

    return successResponse<
      | T
      | {
          documentId: any;
          subColDocId: any;
          subCollection: string;
        }
    >(response, message.DELETE_SUB_COLLECTION_DOC_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.DELETE_SUB_COLLECTION_DOC_ERROR);
  }
}

/**
 * Get documents from collection by using filter.
 * User Where query to filter the data which contains array. [TODO]
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {Object} filterOptions
 *
 * @returns {Promise<Response>}
 */
export async function getFilteredResultByArrayField<T>(
  connection: IConnection,
  collection: string,
  filterOptions?: any
): Promise<Response> {
  try {
    console.log('filterOptions', filterOptions);
    const { filterField, condition, toBeMatchedParam } = filterOptions;

    const result = await connection.firestore
      .collection(collection)
      .where(filterField, condition, toBeMatchedParam)
      .get();

    if (!result.docs.length) {
      return notFoundResponse(message.DOCUMENT_NOT_FOUND);
    }

    return successResponse<T>(result, message.FETCH_DOCUMENT_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.FETCH_DOCUMENT_ERROR);
  }
}

/**
 * Insert doc in sub collection in batch.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} payload
 *
 * @returns {Promise<Response>}
 */
export async function updateCollectionInBatch<T>(
  connection: IConnection,
  collection: string,
  payload: any[]
): Promise<Response> {
  try {
    const db = connection.firestore;
    const batch = db.batch();

    const collectionRef = await db.collection(collection);

    payload.forEach(async (data) => {
      const docRef = await collectionRef.doc(data.userId);

      batch.set(docRef, data);
    });

    await batch.commit();

    const response = {
      data: payload,
    };

    return successResponse<{ data: T[] }>(response, message.UPDATE_SUB_COL_DOC_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.UPDATE_DOCUMENT_ERROR);
  }
}

/**
 * Insert doc in subcollection in batch.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 * @param {string} subCollection
 * @param {any[]} payload
 *
 * @returns {Promise<Response>}
 */
export async function updateSubCollectionInBatch<T>(
  connection: IConnection,
  collection: string,
  docId: any,
  subCollection: string,
  payload: any[]
): Promise<Response> {
  try {
    console.log(payload);
    const db = connection.firestore;
    const batch = db.batch();

    const collectionRef = await db.collection(collection).doc(docId).collection(subCollection);

    payload.forEach(async (data) => {
      const docRef = await collectionRef.doc(data.userId);

      batch.set(docRef, data);
    });

    await batch.commit();

    const response = {
      subCollection,
      data: payload,
      documentId: docId,
    };

    return successResponse<{ subCollection: string; data: T[]; documentId: any }>(
      response,
      message.UPDATE_DOCUMENT_SUCCESS
    );
  } catch (err) {
    return errorResponse(err as Error, message.UPDATE_SUB_COL_DOC_ERROR);
  }
}

/**
 * Delete all documents form sub collection.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {any} docId
 * @param {string} subCollection
 *
 * @returns {Promise<Response>}
 */
export async function deleteAllDocsFromSubCollection<T>(
  connection: IConnection,
  collection: string,
  docId: any,
  subCollection: string
): Promise<Response> {
  try {
    const db = connection.firestore;
    const batch = db.batch();

    const result = await db.collection(collection).doc(docId).collection(subCollection).get();

    result.docs.forEach(async (doc: any) => {
      await batch.delete(doc.ref);
    });

    await batch.commit();

    const response = {
      subCollection,
      documentId: docId,
    };

    return successResponse<T | { subCollection: string; documentId: any }>(
      response,
      message.DELETE_SUB_COLLECTION_DOC_SUCCESS
    );
  } catch (err) {
    return errorResponse(err as Error, message.DELETE_SUB_COLLECTION_DOC_ERROR);
  }
}

/**
 * Delete all docs from collection, including sub collection and its underlying documents.
 *
 * @param {IConnection} connection
 * @param {string} collection
 *
 * @returns {Promise<Response>}
 */
export async function deleteAllDocsFromCollection<T>(connection: IConnection, collection: string): Promise<Response> {
  try {
    const db = connection.firestore;
    const batch = db.batch();

    const result = await db.collection(collection).get();

    result.docs.forEach(async (doc: any) => {
      await batch.delete(doc.ref);
    });

    await batch.commit();

    const response = {
      message: 'Success',
    };

    return successResponse<T | { message: string }>(response, message.DELETE_SUB_COLLECTION_DOC_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.DELETE_SUB_COLLECTION_DOC_ERROR);
  }
}

/**
 * Get document snapShot on any value changes on the document.
 *
 * @param {IConnection} connection
 * @param {string} collection
 * @param {Function} callback
 *
 * @returns {Promise<Response>}
 */
export async function fetchDocsOnSnapShotChange(
  connection: any,
  collection: any,
  callback: any
): Promise<ResponseWithCallback> {
  try {
    const unSubscriber = connection.firestore.collection(collection).onSnapshot(callback);

    if (!unSubscriber) {
      return snapShotErrorResponse(new Error() as Error, message.FETCH_DOCUMENT_ERROR);
    }

    return snapShotResponse(unSubscriber, message.FETCH_DOCUMENT_SUCCESS);
  } catch (error) {
    return snapShotErrorResponse(error as Error, message.FETCH_ALL_DOCUMENTS_ERROR);
  }
}
