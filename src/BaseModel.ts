import * as db from './db';
import * as storage from './storage';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import Response, { SubCollectionPayload, FilterOptionsParam, IConnection, ResponseWithCallback } from './types';

/**
 * Base model for fire store.
 *
 * @param {Object} resolver
 *
 * @returns {Object}
 */
export function createBaseModel(resolver: IConnection | {} = {}): object {
  console.log('i am called', resolver);

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
     * @param {Object} connection
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
     *
     * @returns {Object}
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
     * Get all documents from a collection.
     *
     * @returns {Promise<Response>}
     */
    public static fetchAll<T>(): Promise<Response> {
      return db.fetchAll<T>(this.getConnection(), this.collection);
    }

    /**
     * Get document snapShot on any value changes on the document.
     *
     * @param {Function} callback
     *
     * @returns {Promise<ResponseWithCallback>}
     */
    static fetchDocsOnSnapShotChange(callback: any): Promise<ResponseWithCallback> {
      return db.fetchDocsOnSnapShotChange(this.getConnection(), this.collection, callback);
    }

    /**
     * Get document by its document id..
     *
     * @param {any} docId
     *
     * @returns {Promise<Response>}
     */
    public static async findDocumentById<T>(docId: any): Promise<Response> {
      return db.findDocumentById<T>(this.getConnection(), this.collection, docId);
    }

    /**
     * Get document snapShot by its id.
     *
     * @param {Number} docId
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
     * @param {any} docId
     * @param {T} payload
     *
     * @returns {Promise<Response>}
     */
    public static save<T>(docId: any, payload: T): Promise<Response> {
      return db.save<T>(this.getConnection(), this.collection, docId, payload);
    }

    /**
     * Update document by document id.
     *
     * @param {any} docId
     * @param {T} payload
     */
    public static updateDocumentById<T>(docId: any, payload: T): Promise<Response> {
      return db.updateDocumentById<T>(this.getConnection(), this.collection, docId, payload);
    }

    /**
     * Update document by id and fetch the latest changes and return the payload.
     *
     * @param {any} docId
     * @param {any} payload
     *
     * @returns {Promise<Response>}
     */
    public static updateDocumentByIdWithPayload<T>(docId: any, payload?: any): Promise<Response> {
      return db.updateDocumentByIdWithPayload<T>(this.getConnection(), this.collection, docId, payload);
    }

    /**
     * Fetch data with pagination.
     *
     * @param {object} filterOptions
     *
     * @returns {Promise<Response>}
     */
    public static fetchDataWithPagination<T>(filterOptions: FilterOptionsParam | {} = {}): Promise<Response> {
      if (!Object.keys(filterOptions).length) {
        filterOptions = {
          startIndex: 0,
          paginationLimit: 5,
        };
      }

      return db.fetchDataWithPagination<T>(this.getConnection(), this.collection, filterOptions as FilterOptionsParam);
    }

    /**
     * Fetch data with pagination.
     *
     * @param {any} docId
     * @param {string} subCollection
     * @param {object} filterOptions
     *
     * @returns {Promise<Response>}
     */
    public static fetchSubColDataWithPagination<T>(
      docId: any,
      subCollection: string,
      filterOptions: any = {}
    ): Promise<Response> {
      if (!Object.keys(filterOptions).length) {
        filterOptions = {
          field: '',
          type: 'asc',
          paginationLimit: 5,
        };
      }

      return db.fetchSubColDataWithPagination<T>(
        this.getConnection(),
        this.collection,
        docId,
        subCollection,
        filterOptions
      );
    }

    /**
     * Get data from sub collection.
     *
     * @param {any} docId
     * @param {string} subCollection
     * @param {any} filterOptions
     *
     * @returns {Promise<Response>}
     */
    public static getSubCollectionData<T>(docId: any, subCollection: string, filterOptions?: any): Promise<Response> {
      return db.getSubCollectionData<T>(this.getConnection(), this.collection, docId, subCollection, filterOptions);
    }

    /**
     * Get data from sub collection by its id.
     *
     * @param {any} docId
     * @param {string} subCollection
     *
     * @returns {Promise<Response>}
     */
    public static getSubCollectionDocById<T>(docId: any, subCollection: string, subColId: any): Promise<Response> {
      return db.getSubCollectionDocById<T>(this.getConnection(), this.collection, docId, subCollection, subColId);
    }

    /**
     * Add data to a sub collection.
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
     * Update sub collection document identified by subColDocId and returns the updated payload.
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
     * @param {any} docId
     *
     * @returns {Promise <Response>}
     */
    public static deleteCollectionDocById<T>(docId: any): Promise<Response> {
      return db.deleteCollectionDocById<T>(this.getConnection(), this.collection, docId);
    }

    /**
     * Delete sub collection doc identified by it subColDocId.
     *
     * @param {any} docId
     * @param {any} subColDocId
     * @param {string} subCol
     *
     * @returns {Promise <Response>}
     */
    public static deleteSubColDocById<T>(docId: any, subCol: string, subColDocId: any): Promise<Response> {
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
     * @param {any} eventId
     * @param {string} subCollection
     *
     * @returns {Promise <Response>}
     */
    public static deleteAllDocsFromSubCollection<T>(eventId: any, subCollection: string): Promise<Response> {
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
     * @param {any} eventId
     * @param {string} subCollection
     * @param {any} payload
     *
     * @returns {Promise <Response>}
     */
    public static updateSubCollectionInBatch<T>(eventId: any, subCollection: string, payload: any): Promise<Response> {
      return db.updateSubCollectionInBatch<T>(this.getConnection(), this.collection, eventId, subCollection, payload);
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
