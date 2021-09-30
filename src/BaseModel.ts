import * as db from './db';
import * as storage from './storage';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import Response, {
  DocId,
  IConnection,
  CallBackFunc,
  PaginationParams,
  ResponseWithCallback,
  SubCollectionPayload,
} from './types';

/**
 * Base model for firestore and firebase storage.
 *
 * @param {IConnection} resolver
 *
 * @returns {object}
 */
export function createBaseModel(resolver: IConnection | {} = {}): object {
  /**
   * Base class.
   */
  return class BaseModel {
    public static collection: string;
    public static firestore: Firestore;
    public static storage: FirebaseStorage;

    /**
     * Bind connection to respective types.
     *
     * @param {IConnection} connection
     *
     * @returns {void}
     */
    public static bindConnection(connection: IConnection): void {
      if (connection.firestore) {
        this.firestore = connection.firestore();
      }

      if (connection.storage) {
        this.storage = connection.storage();
      }
    }

    /**
     * Establish connection.
     */
    public static getConnection() {
      if (this.firestore) {
        this.firestore;
      }

      if (this.storage) {
        this.storage;
      }

      if (Object.keys(resolver).length > 0) {
        this.bindConnection(resolver as IConnection);
      }

      return this;
    }

    /**
     * Fetch all documents in a collection.
     *
     * @returns {Promise<Response>}
     */
    public static fetchAll<T>(): Promise<Response> {
      return db.fetchAll<T>(this.getConnection(), this.collection);
    }

    /**
     * Get document snapShot.
     * Any changes in the collection will get the snapshot changes.
     * So ,it's like subscribing,it will keep listening to the collection update,
     * So in every change on the collection callback will execute with the added payload.
     *
     * @param {CallBackFunc} callback
     *
     * @returns {Promise<ResponseWithCallback>}
     */
    static fetchDocsOnSnapShotChange(callback: CallBackFunc): Promise<ResponseWithCallback> {
      return db.fetchDocsOnSnapShotChange(this.getConnection(), this.collection, callback);
    }

    /**
     * Get document identified by its document id.
     *
     * @param {DocId} docId
     *
     * @returns {Promise<Response>}
     */
    public static async findDocumentById<T>(docId: DocId): Promise<Response> {
      return db.findDocumentById<T>(this.getConnection(), this.collection, docId);
    }

    /**
     * Get document snapShot by identified by id.
     * Any changes in the document identified by the doc id will get the snapshot changes.
     * So ,it's like subscribing,it will keep listening to the document update,
     * So in every change on the document identified by docId, the call back will execute with the added payload.
     *
     * @param {any} docId
     * @param {Function} callback
     *
     * @returns {Promise<Response>}
     */
    public static findDocumentSnapShotById(docId: any, callback: any): Promise<ResponseWithCallback> {
      return db.findDocumentSnapShotById(this.getConnection(), this.collection, docId, callback);
    }

    /**
     * Save document to a collection.
     *
     * @param {DocId} docId
     * @param {any} payload
     *
     * @returns {Promise<Response>}
     */
    public static save<T>(docId: DocId, payload: any): Promise<Response> {
      return db.save<T>(this.getConnection(), this.collection, docId, payload);
    }

    /**
     * Update document identified by docId.
     *
     * @param {DocId} docId
     * @param {any} payload
     *
     * @returns {Promise<Response>}
     */
    public static updateDocumentById<T>(docId: DocId, payload: any): Promise<Response> {
      return db.updateDocumentById<T>(this.getConnection(), this.collection, docId, payload);
    }

    /**
     * Update document identified by docId.
     * Updates the doc and the fetches the document again , to make it up to date with the doc on db,
     * and return the latest fetched data.
     *
     * @param {DocId} docId
     * @param {any} payload
     *
     * @returns {Promise<Response>}
     */
    public static updateDocumentByIdWithPayload<T>(docId: DocId, payload?: any): Promise<Response> {
      return db.updateDocumentByIdWithPayload<T>(this.getConnection(), this.collection, docId, payload);
    }

    /**
     * Fetch document with pagination.
     * Also order the document so need to provide field by which the order will take place.
     * eg. {field:"name",type:"asc",startIndex:0,endIndex:50}
     *
     * @param {PaginationParams} paginationPayload
     *
     * @returns {Promise<Response>}
     */
    public static fetchDataWithPagination<T>(paginationPayload: PaginationParams | {} = {}): Promise<Response> {
      if (!Object.keys(paginationPayload).length) {
        paginationPayload = {
          field: '',
          type: 'asc',
          startIndex: 0,
          endIndex: 50,
        };
      }

      return db.fetchDataWithPagination<T>(
        this.getConnection(),
        this.collection,
        paginationPayload as PaginationParams
      );
    }

    /**
     * Fetch document with pagination.
     * Also order the document so need to provide field by which the order will take place.
     * eg. {field:"name",type:"asc",startIndex:0,endIndex:50}
     *
     * @param {DocId} docId
     * @param {string} subCollection
     * @param {object} paginationPayload
     *
     * @returns {Promise<Response>}
     */
    public static fetchSubColDataWithPagination<T>(
      docId: DocId,
      subCollection: string,
      paginationPayload: PaginationParams | {}
    ): Promise<Response> {
      if (!Object.keys(paginationPayload).length) {
        paginationPayload = {
          field: '',
          type: 'asc',
          startIndex: 0,
          endIndex: 50,
        };
      }
      return db.fetchSubColDataWithPagination<T>(
        this.getConnection(),
        this.collection,
        docId,
        subCollection,
        paginationPayload as PaginationParams
      );
    }

    /**
     * Fetch all documents from sub collection.
     * Also filter options can send to order the documents.
     * It will order the document according to provided options
     * eg. field = 'name' and type = 'asc'
     *
     * @param {DocId} docId
     * @param {string} subCollection
     * @param {{ field: string; type: string }} filterOptions
     *
     * @returns {Promise<Response>}
     */
    public static getAllSubCollectionDocs<T>(
      docId: DocId,
      subCollection: string,
      filterOptions?: { field: string; type: string }
    ): Promise<Response> {
      return db.getAllSubCollectionDocs<T>(this.getConnection(), this.collection, docId, subCollection, filterOptions);
    }

    /**
     * Get sub collection document identified by subColId.
     *
     * @param {DocId} docId
     * @param {string} subCollection
     *
     * @returns {Promise<Response>}
     */
    public static getSubCollectionDocById<T>(docId: DocId, subCollection: string, subColId: any): Promise<Response> {
      return db.getSubCollectionDocById<T>(this.getConnection(), this.collection, docId, subCollection, subColId);
    }

    /**
     * Add data to a sub collection, merge on conflict.
     *
     * @param {AddSubCollectionDataPayload} payload
     *
     * @returns {Promise<Response>}
     */
    public static addDataToSubCollection<T>(payload: SubCollectionPayload<T>): Promise<Response> {
      return db.addDataToSubCollection<T>(this.getConnection(), this.collection, payload);
    }

    /**
     * Update sub collection documents identified by subColDocId.
     *
     * @param {SubCollectionPayload<T>} payload
     *
     * @returns {Promise<Response>}
     */
    public static updateSubCollectionDoc<T>(payload: SubCollectionPayload<T>): Promise<Response> {
      return db.updateSubCollectionDoc<T>(this.getConnection(), this.collection, payload);
    }

    /**
     * Update sub collection document identified by subColDocId.
     * Updates the doc and the fetches the document again , to make it up to date with the doc on db,
     * and return the latest fetched data.
     *
     * @param {SubCollectionPayload<T>} payload
     *
     * @returns {Promise<Response>}
     */
    public static updateSubCollectionWithPayload<T>(payload: SubCollectionPayload<T>): Promise<Response> {
      return db.updateSubCollectionWithPayload<T>(this.getConnection(), this.collection, payload);
    }

    /**
     * Delete collection doc identified by id.
     *
     * @param {DocId} docId
     *
     * @returns {Promise <Response>}
     */
    public static deleteCollectionDocById<T>(docId: DocId): Promise<Response> {
      return db.deleteCollectionDocById<T>(this.getConnection(), this.collection, docId);
    }

    /**
     * Delete sub collection doc identified by subColDocId.
     *
     * @param {DocId} docId
     * @param {DocId} subColDocId
     * @param {string} subCol
     *
     * @returns {Promise <Response>}
     */
    public static deleteSubColDocById<T>(docId: DocId, subCol: string, subColDocId: DocId): Promise<Response> {
      return db.deleteSubColDocById<T>(this.getConnection(), this.collection, docId, subCol, subColDocId);
    }

    /**
     * Get the document by applying the provided filter options.
     * Filter by array.
     *
     * @param {any} [filterOptions]
     *
     * @returns {Promise <Response>}
     */
    public static getFilteredResultByArrayField<T>(filterOptions?: any): Promise<Response> {
      return db.getFilteredResultByArrayField<T>(this.getConnection(), this.collection, filterOptions);
    }

    /**
     * Upload image to storage.
     *
     * @param {any} ref
     * @param {File} imageFile
     *
     * @returns {Promise<Object | Null>}
     */
    public static uploadImage<T>(ref: any, imageFile: any): Promise<Response> {
      return storage.uploadImageToStorage<T>(this.getConnection(), ref, imageFile);
    }

    /**
     * Get the url of the image
     * after uploaded to the storage.
     *
     * @param {string} filePath
     *
     * @returns {Promise<Response>}
     */
    public static getDownloadFileUrl<T>(filePath: string): Promise<Response> {
      return storage.getDownloadFileUrl<T>(this.getConnection(), filePath);
    }

    /**
     * Get the url of the image
     * after uploaded to the storage.
     *
     * @param {String} ref
     * @param {File} imageFile
     *
     * @returns {Promise<String | Null>}
     */
    public static async uploadImageAndGetUrl<T>(ref: any, imageFile: object): Promise<Response> {
      const uploadedImage = await this.uploadImage<T>(ref, imageFile);

      if (!uploadedImage.data) {
        return uploadedImage;
      }

      const imageUrl = await this.getDownloadFileUrl<T>(uploadedImage.data.metadata.fullPath);

      if (!imageUrl.data) {
        return imageUrl;
      }

      return imageUrl;
    }

    /**
     * Delete docs from sub collection in batch.
     *
     * @param {DocId} docId
     * @param {string} subCollection
     *
     * @returns {Promise <Response>}
     */
    public static deleteAllDocsFromSubCollection<T>(eventId: DocId, subCollection: string): Promise<Response> {
      return db.deleteAllDocsFromSubCollection<T>(this.getConnection(), this.collection, eventId, subCollection);
    }

    /**
     * Delete all docs from collection, including sub collection and its underlying documents.
     *
     * @returns {Promise <Response>}
     */
    public static deleteAllDocsFromCollection(): Promise<Response> {
      return db.deleteAllDocsFromCollection(this.getConnection(), this.collection);
    }

    /**
     * Add or update data in sub collection in batch.
     *
     * @param {DocId} docId
     * @param {string} subCollection
     * @param {any} payload
     *
     * @returns {Promise <Response>}
     */
    public static updateSubCollectionInBatch<T>(docId: DocId, subCollection: string, payload: any): Promise<Response> {
      return db.updateSubCollectionInBatch<T>(this.getConnection(), this.collection, docId, subCollection, payload);
    }

    /**
     * Add or update data in sub collection in batch.
     *
     * @param {any} payload
     *
     * @returns {Promise <Response>}
     */
    public static updateCollectionInBatch<T>(payload: any): Promise<Response> {
      return db.updateCollectionInBatch<T>(this.getConnection(), this.collection, payload);
    }
  };
}
