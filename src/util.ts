import Response, { CallBackFunc, ResponseWithCallback } from './types';

/**
 * Generate success payload.
 *
 * @param {object} data
 * @param {string} message
 *
 * @returns {Response}
 */
export function successResponse<T>(data: T | T[], message: string): Response {
  return {
    data,
    message,
    error: null,
    status: 'OK',
  };
}

/**
 * Generate not found response.
 *
 * @param {string} message
 *
 * @returns {Response}
 */
export function notFoundResponse(message: string): Response {
  return {
    message,
    data: null,
    error: message,
    status: 'NOT_FOUND',
  };
}

/**
 * Generate operation failed payload.
 *
 * @param {String} message
 *
 * @returns {Response}
 */
export function operationFailed(message: string): Response {
  return {
    message,
    data: null,
    error: message,
    status: 'OPERATION_FAILED',
  };
}

/**
 * Generate error response.
 *
 * @param {Error} err
 * @param {String} message
 *
 * @returns {Response}
 */
export function errorResponse(err: Error, message: string): Response {
  return {
    message,
    data: null,
    error: err,
    status: 'INTERNAL_SERVER_ERROR',
  };
}

/**
 * Generate snapShot response.
 *
 * @param {Function} unSubscriber
 * @param {String} status
 * @param {CallBackFunc} callback
 *
 * @returns {ResponseWithCallback}
 */
export function snapShotResponse(unSubscriber: any, status: string, callback?: CallBackFunc): ResponseWithCallback {
  return {
    error: null,
    status: status,
    callback: callback,
    unSubscribe: unSubscriber,
  };
}

/**
 * Generate snapShotError response.
 *
 * @param {string} message
 * @param {Error} error
 *
 * @returns {ResponseWithCallback}
 */
export function snapShotErrorResponse(error?: Error, message?: string): ResponseWithCallback {
  return {
    message,
    status: 'Error',
    callback: null,
    error: error || null,
  };
}
