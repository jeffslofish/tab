
import UserModel from './UserModel'

/**
 * Fetch the user by username.
 * @param {object} userContext - The user authorizer object.
 * @param {string} username - The user's username.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const getUserByUsername = async (userContext, username) => {
  return UserModel.query(userContext, username)
    .usingIndex('UsersByUsername')
    .execute()
    .then((result) => {
      if (result.length > 0) {
        return result[0]
      } else {
        return null
      }
    })
}

export default getUserByUsername