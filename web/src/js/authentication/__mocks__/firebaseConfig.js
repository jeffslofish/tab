
import * as firebase from 'firebase'

const config = {
  apiKey: 'abc123',
  authDomain: 'localhost',
  databaseURL: 'foo',
  projectId: 'xyz'
}

export const initializeFirebase = () => {
  firebase.initializeApp(config)
}
