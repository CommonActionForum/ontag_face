/**
 * Handles Errors that the API can throw.
 * - Definition of error codes
 * - Constructor for certain error Types
 */
const FORBIDDEN = 'forbidden'
const INVALID_REQUEST = 'invalid request'
const SERVER_ERROR = 'server error'
const UNAUTHENTICATED = 'unauthenticated'
const UNPROCESSABLE_JSON = 'unprocessable json'

// Transforms code into a message
function getDefaultMessage (code) {
  return {
    [FORBIDDEN]: 'You are not allowed to perform this operation',
    [INVALID_REQUEST]: 'Parameters provided have some problems',
    [SERVER_ERROR]: 'Server is causing some errors',
    [UNAUTHENTICATED]: 'You have to log in to perform this operation',
    [UNPROCESSABLE_JSON]: 'The JSON retrieved from the server is not processable. This is probably our fault :('
  }[code]
}

// Transform HTTP status into code
function getDefaultCode (status) {
  return {
    401: UNAUTHENTICATED,
    403: FORBIDDEN
  }[status]
}

export function APIError ({code, message}) {
  this.type = 'APIError'
  this.code = code || SERVER_ERROR
  this.message = message || getDefaultMessage(this.code)
}

export function AuthenticationError ({status, code, message}) {
  this.type = 'AuthenticationError'
  this.code = code || getDefaultCode(status)
  this.message = message || getDefaultMessage(this.code)
}

export function ClientError ({status, code, message}) {
  this.type = 'ClientError'
  this.code = code || getDefaultCode(status)
  this.message = message || getDefaultMessage(this.code)
}

export function ConnectionError () {
  this.type = 'ConnectionError'
}

export function InvalidRequestError ({message, errors}) {
  this.type = 'InvalidRequestError'
  this.message = message || getDefaultMessage(INVALID_REQUEST)
  this.errors = errors || {}
}

export const ErrorCodes = {
  FORBIDDEN,
  INVALID_REQUEST,
  SERVER_ERROR,
  UNAUTHENTICATED,
  UNPROCESSABLE_JSON
}
