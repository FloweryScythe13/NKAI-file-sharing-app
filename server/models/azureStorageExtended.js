/* Extension of Azure Blob Service to retrieve both Blobs and BlobPrefixes for a given hierarchical level in a single 
 * call. 
 *
 * Defunct/buggy code. 
*/


var azureStorageExt = require('azure-storage');
var BlobServiceExt = require('./BlobServiceExtended');

azureStorageExt.createBlobServiceExtended = function(storageAccountOrConnectionString, storageAccessKey, host) {
    return new BlobServiceExt(storageAccountOrConnectionString, storageAccessKey, host, null);
}

module.exports = azureStorageExt;