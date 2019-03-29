var parcelDB = (function() {
    var tDB = {};
    var datastore = null;

    /**
     * Open a connection to the datastore.
     */
    tDB.open = function(callback) {
        // Database version.
        var version = 1;

        // Open a connection to the datastore.
        var request = indexedDB.open('parcels', version);

        // Handle datastore upgrades.
        request.onupgradeneeded = function(e) {
            var db = e.target.result;

            e.target.transaction.onerror = tDB.onerror;

            // Delete the old datastore.
            if (db.objectStoreNames.contains('parcel')) {
              db.deleteObjectStore('parcel');
            }

            // Create a new datastore.
            var store = db.createObjectStore('parcel', {
              keyPath: 'timestamp'
            });
        };

        // Handle successful datastore access.
        request.onsuccess = function(e) {
            // Get a reference to the DB.
            datastore = e.target.result;

            // Execute the callback.
            callback();
        };

        // Handle errors when opening the datastore.
        request.onerror = tDB.onerror;
    };//end tDB open function

    /**
     * Fetch all of the parcel items in the datastore.
     */
    tDB.fetchparcels = function(callback) {
        var db = datastore;
        var transaction = db.transaction(['parcel'], 'readwrite');
        var objStore = transaction.objectStore('parcel');

        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = objStore.openCursor(keyRange);

        var parcels = [];

        transaction.oncomplete = function(e) {
            // Execute the callback function.
            callback(parcels);
        };

        cursorRequest.onsuccess = function(e) {
            var result = e.target.result;

            if (!!result == false) {
            return;
            }

            parcels.push(result.value);

            result.continue();
        };

        cursorRequest.onerror = tDB.onerror;
    };//end fetchparcels

    /**
 * Create a new parcel item.
 */
tDB.createparcel = function(parcel, callback) {
  // Get a reference to the db.
  var db = datastore;

  // Initiate a new transaction.
  var transaction = db.transaction(['parcel'], 'readwrite');

  // Get the datastore.
  var objStore = transaction.objectStore('parcel');

  // Create a timestamp for the parcel item.
  var timestamp = new Date().getTime();

  // Create an object for the parcel item.
  var parcel = parcel;



  // Create the datastore request.
  var request = objStore.put(parcel);

  // Handle a successful datastore put.
  request.onsuccess = function(e) {
    // Execute the callback function.
    callback(parcel);
  };

  // Handle errors.
  request.onerror = tDB.onerror;
};

/**
 * Delete a parcel item.
 */
tDB.deleteparcel = function(id, callback) {
  var db = datastore;
  var transaction = db.transaction(['parcel'], 'readwrite');
  var objStore = transaction.objectStore('parcel');

  var request = objStore.delete(id);

  request.onsuccess = function(e) {
    callback();
  }

  request.onerror = function(e) {
    console.log(e);
  }
};

    // Export the tDB object.
    return tDB;
}());