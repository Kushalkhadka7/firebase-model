import * as message from './message';
import Response, { IConnection } from './types';
import { errorResponse, successResponse, operationFailed } from './util';

/**
 * Get document by id.
 *
 * @param {IConnection} connection
 * @param {string} imageRef
 * @param {object} imageFile
 *
 * @returns {Promise<Response>}
 */
export async function uploadImageToStorage<T>(
  connection: IConnection,
  imageRef: string,
  imageFile: object
): Promise<Response> {
  try {
    const storageRef = await connection.storage.ref(imageRef);
    const data = await storageRef.putFile(imageFile);

    if (!data) {
      return operationFailed(message.UNABLE_TO_UPLOAD_IMAGE);
    }

    return successResponse<T>(data, message.UPLOAD_IMAGE_SUCCESS);
  } catch (err) {
    return errorResponse(err as Error, message.UNABLE_TO_UPLOAD_IMAGE);
  }
}

/**
 * Get download able url from the uploaded image path to storage.
 *
 * @param {IConnection} connection
 * @param {string} filePath
 *
 * @returns {Promise<Response>}
 */
export async function getDownloadFileUrl<T>(connection: IConnection, filePath: string): Promise<Response> {
  const url = await connection.storage.ref(filePath).getDownloadURL();

  if (!url) {
    return operationFailed(message.UNABLE_GET_IMAGE_URL);
  }

  return successResponse<T | string>(url, message.GET_IMAGE_URL_SUCCESS);
}
