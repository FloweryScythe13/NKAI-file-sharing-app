var azure = require('../models/azureStorageExtended');
var util = require('util');
var fs = require('fs');

var azureBlobsController = function() {
    function readConfig() {
        return JSON.parse(fs.readFileSync('./app.config', 'utf8'));
      }

    function AzureBlobReader(blobService, containerName, prefix) {
        this.blobService = blobService;
        this.containerName = containerName;
        this.prefix = prefix;
        this.items = { files: [], directories: [] }
    }

    AzureBlobReader.prototype.directoryAndBlobRetriever = function(token) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.blobService.listBlobsAndDirectoriesSegmentedWithPrefix(self.containerName, self.prefix, token, null, function(error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                else {
                    resolve(result);
                }
            })
        });
    }

    AzureBlobReader.prototype.listBlobsAndDirectories = function(token) {
        var self = this;
        function handler(r) {
            self.items.files.push.apply(self.items.files, r.entries.blobs);
            self.items.directories.push.apply(self.items.directories, r.entries.directories);
            if (r.continuationToken) {
                return self.listBlobsAndDirectories(r.continuationToken);
            }
            else {
                return self.items;
            }
        }

        return this.directoryAndBlobRetriever(token).then(handler);
    }

    AzureBlobReader.prototype.blobRetriever = function(token) {
        var self = this;
        
        return new Promise(function (resolve, reject) {
            self.blobService.listBlobsSegmentedWithPrefix(self.containerName, self.prefix, token, null, function(error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                else {
                    resolve(result);
                }
            })
        });
    }

    AzureBlobReader.prototype.listBlobs = function(token) {
        var self = this;
        function handler(r) {
            self.items.files.push.apply(self.items.files, r.entries);
            if (r.continuationToken) {
                return self.listBlobs(r.continuationToken);
            }
            else {
                return self.blobs;
            }
        }
    }
    
    function getFiles(collection){
        var items = [];
        for(var key in collection){
            var item = collection[key];
            var itemName = item.name.split('/')[item.name.split('/').length - 1];
            items.push({ 'text': itemName, 'classes': 'file'});
        }
        return items;
    }
    
    function getFoldersFromCollection(containerName, collection){
        var items = [];
        //if BlobPrefix contains one folder is a simple JSON. Otherwise is an array of JSONs
        if (collection && !collection.length){
            temp = collection;
            collection = [];
            collection.push(temp);
        }
        for(var key in collection){
            var item = collection[key];
            var itemName = item.Name.replace(/\/$/, '').split('/')[item.Name.replace(/\/$/, '').split('/').length - 1];
            items.push({ 'text': itemName, 'classes': 'folder' });
        }
        return items;
    }
    

    function getBlobCatalog(directoryName) {
        var blobService = azure.createBlobServiceExtended(readConfig().connectionString);

        var container = 'newknowledgedata';
        var directory = directoryName ? decodeURI(directoryName) : null;
        if (directory != null && directory.charAt(0) === '/') {
            directory = directory.substring(1, directory.length)
        }
        var output = '';

        var reader = new AzureBlobReader(blobService, container, directory);
        console.log(reader.prefix);
        var promise = reader.listBlobsAndDirectories().then(function(values) {
            console.log(values);
            return values;
        }).catch(function(error) {
            console.log(error);
        });

        return promise;
    }
    
    
    

    /**
    * Lists blobs in the container.
    * @ignore
    *
    * @param {BlobService}        blobService                         The blob service client.
    * @param {string}             container                           The container name.
    * @param {object}             token                               A continuation token returned by a previous listing operation. 
    *                                                                 Please use 'null' or 'undefined' if this is the first operation.
    * @param {object}             [options]                           The request options.
    * @param {int}                [options.maxResults]                Specifies the maximum number of directories to return per call to Azure ServiceClient. 
    *                                                                 This does NOT affect list size returned by this function. (maximum: 5000)
    * @param {LocationMode}       [options.locationMode]              Specifies the location mode used to decide which location the request should be sent to. 
    *                                                                 Please see StorageUtilities.LocationMode for the possible values.
    * @param {int}                [options.timeoutIntervalInMs]       The server timeout interval, in milliseconds, to use for the request.
    * @param {int}                [options.maximumExecutionTimeInMs]  The maximum execution time, in milliseconds, across all potential retries, to use when making this request.
    *                                                                 The maximum execution time interval begins at the time that the client begins building the request. The maximum
    *                                                                 execution time is checked intermittently while performing requests, and before executing retries.
    * @param {string}             [options.clientRequestId]           A string that represents the client request ID with a 1KB character limit.
    * @param {bool}               [options.useNagleAlgorithm]         Determines whether the Nagle algorithm is used; true to use the Nagle algorithm; otherwise, false.
    *                                                                 The default value is false.
    * @param {errorOrResult}      callback                            `error` will contain information
    *                                                                 if an error occurs; otherwise `result` will contain `entries` and `continuationToken`. 
    *                                                                 `entries`  gives a list of directories and the `continuationToken` is used for the next listing operation.
    *                                                                 `response` will contain information related to this operation.
    */
    function listBlobs(blobService, container, token, options, blobs, callback) {
        blobs = blobs || [];
    
        blobService.listBlobsSegmented(container, token, options, function (error, result) {
        if (error) return callback(error);
    
        blobs.push.apply(blobs, result.entries);
        var token = result.continuationToken;
        if (token) {
            console.log('   Received a segment of results. There are ' + result.entries.length + ' blobs on this segment.');
            listBlobs(blobService, container, token, options, blobs, callback);
        } else {
            console.log('   Completed listing. There are ' + blobs.length + ' blobs.');
            callback(null, blobs);
        }
        });
    }

    

    return {
        getBlobCatalog: getBlobCatalog
    }
}

  
module.exports = azureBlobsController;