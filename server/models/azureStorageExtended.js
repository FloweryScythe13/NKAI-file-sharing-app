var azureStorageExt = require('azure-storage');
var BlobServiceExt = require('./BlobServiceExtended');

azureStorageExt.createBlobServiceExtended = function(storageAccountOrConnectionString, storageAccessKey, host) {
    return new BlobServiceExt(storageAccountOrConnectionString, storageAccessKey, host, null);
}

module.exports = azureStorageExt;