# Firebase Model (Firestore and storage)

## Installation

```
yarn add firebase-model or npm install firebase-model
```

## Usage

 Firebase model can be used with react js and react native.
### With ReactJS.
```
model.js

import { storage, firestore } from 'firebase';
import { createBaseModel } from 'firebase-model/dist';

// Initialize firebase connection.
const BaseModel = createBaseModel({ firestore, storage });

# Create base model.
# If new common functions are to be added then, they can be added in this Model class.
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
`Note: Storage should be used if firebase storage is needed.`

### With React native.
```
model.js

import storage from '@react-native-firebase/storage';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { createBaseModel } from './BaseModel/BaseModel';

// Initialize firebase connection.
const BaseModel = createBaseModel({ firestore, storage });

# Create base model.
# If new common functions are to be added then, they can be added in this Model class.
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
`Note: Storage should be used if firebase storage is needed.`

### Adding additional functions.

```
model.js

import { storage, firestore } from 'firebase';
import { createBaseModel } from 'firebase-model/dist';

// Initialize firebase connection.
const BaseModel = createBaseModel({ firestore, storage });

# Create base model.
# If new common functions are to be added then, they can be added in this Model class.
class Model extends BaseModel {
  
  /**
   * Upload image to firebase storage.
   *
   * @param {String} ref
   * @param {File} imageFile
   *
   * @returns {Promise<Object | Null>}
   */
  static async uploadImage(ref, imageFile) {
    const reference = await storage().ref(ref);
    const data = await reference.putFile(imageFile);

    if (!data) {
      return null;
    }

    return data;
  }
}

export default Model;


# Usage.
class Event extends Model {
  static collection = 'users';

  /**
  * Fetch All Events.
  *
  * @returns {Promise<Object>}
  */
  static uploadImage(ref, imageFile) {
    return super.uploadImage(ref, imageFile);
  }
}
```

### Developing locally
- Clone the repo.
- `yarn or npm install`
- `yarn tsc:watch or npm run tsc:watch`
- Navigate to to `node_modules` of the repo in which this package is to be used.
- `ln -s <path_to_root_dir_of_firebase-model_package> .`