# Firebase Model (Firestore and storage)


### With ReactJS.
```
model.js

import { storage, firestore } from 'firebase';
import { createBaseModel } from 'firebase-model/dist';

// Initialize firebase connection.
const BaseModel = createBaseModel({ firestore, storage });

# Create base model.
# If new functions needed to be added they can be added in this class.
class Model extends BaseModel {}

export default Model;


# Usage.
class Event extends Model {
  static collection = 'users';

  /**
  * Fetch All Events.
  *
  * @returns {Promise<Object>}
  */
  static fetchAllUsers() {
    return super.fetchAll();
  }
}
```


### With React native.
```
model.js

import storage from '@react-native-firebase/storage';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { createBaseModel } from './BaseModel/BaseModel';

// Initialize firebase connection.
const BaseModel = createBaseModel({ firestore, storage });

# Create base model.
# If new functions needed to be added they can be added in this class.
class Model extends BaseModel {}

export default Model;


# Usage.
class Event extends Model {
  static collection = 'users';

  /**
  * Fetch All Events.
  *
  * @returns {Promise<object>}
  */
  static fetchAllUsers() {
    return super.fetchAll();
  }
}
```