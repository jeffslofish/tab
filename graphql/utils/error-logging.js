
import uuid from 'uuid'
import logger from './logger'

/*
 * Wrap a function and log all exceptions, then re-throw the
 * exception.
 * @param {function} func - The function to wrap.
 * @return {null}
 */
export const logExceptionsWrapper = (func) => {
  return function () {
    try {
      return func.apply(this, arguments)
    } catch (e) {
      logger.error(e)
      throw e
    }
  }
}

/*
 * Format GraphQL error before sending to the client.
 * Spec: https://github.com/graphql/graphql-js/blob/master/src/error/formatError.js#L19
 * @param {object} graphQLError - The GraphQL error.
 * @return {object} The error to send to the client.
 */
export const formatError = (graphQLError) => {
  return {
    message: graphQLError.message,
    locations: graphQLError.locations,
    path: graphQLError.path
  }
}

/*
 * The handler for any GraphQL errors, primarily for logging and
 * formatting errors.
 * We will use this as the `formatError` function in graphQLHTTP.
 * @param {object} graphQLError - The GraphQL error.
 * @return {object} The error to send to the client (optionally formatted).
 */
export const handleError = (graphQLError) => {
  // Return masked error messages to the client side to
  // prevent leakage of any sensitive info.
  // Inspired by graphql-errors package:
  // https://github.com/kadirahq/graphql-errors/blob/master/lib/index.js#L29
  const errId = uuid.v4()

  // Log the error.
  const errToLog = new Error(graphQLError.message)
  errToLog.message = `${graphQLError.message}: Error ID ${errId}`
  logger.error(errToLog)

  // Format and return the error.
  const errToReturn = new Error(graphQLError.message)
  errToReturn.message = `Internal Error: ${errId}`
  return formatError(errToReturn)
}
