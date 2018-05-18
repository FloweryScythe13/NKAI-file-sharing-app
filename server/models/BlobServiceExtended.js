var azure = require('azure-storage');
var _ = require('underscore');
var extend = require('extend');
var BlobService = azure.BlobService;
var BlobResult = require('./blobresult');
var azureutil = require('../utils/azure-ported-utils');
var WebResource = azure.WebResource;
var QueryStringConstants = azure.Constants.QueryStringConstants;

BlobService.prototype.listBlobsAndDirectoriesSegmentedWithPrefix = function(container, prefix, currentToken, optionsOrCallback, callback) {
    var userOptions;
    azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { userOptions = o; callback = c; });
    userOptions.delimeter = '/';
    azure.Validate.validateArgs('listBlobsSegmented', function (v) {
        v.string(container, 'container');
        v.containerNameIsValid(container);
        v.callback(callback);
    });

    var options = extend(true, {}, userOptions);
    var webResource = WebResource.get(container)
        .withQueryOption(QueryStringConstants.RESTYPE, 'container')
        .withQueryOption(QueryStringConstants.COMP, 'list')
        .withQueryOption(QueryStringConstants.MAX_RESULTS, options.maxResults)
        .withQueryOptions(options,
        QueryStringConstants.DELIMITER,
        QueryStringConstants.INCLUDE);

    if (!azureutil.objectIsNull(currentToken)) {
        webResource.withQueryOption(QueryStringConstants.MARKER, currentToken.nextMarker);
    }

    webResource.withQueryOption(QueryStringConstants.PREFIX, prefix);

    options.requestLocationMode = azureutil.getNextListingLocationMode(currentToken);

    var processResponseCallback = function (responseObject, next) {
        responseObject.listBlobsResult = null;
        if (!responseObject.error) {
            responseObject.listBlobsResult = {
                entries: null,
                continuationToken: null
            };

            responseObject.listBlobsResult.entries = {directories: [], blobs: []};
            var dresults = [];
            var bresults = [];

            if (responseObject.response.body.EnumerationResults.Blobs.BlobPrefix) {
                dresults = responseObject.response.body.EnumerationResults.Blobs.BlobPrefix;
                if (!_.isArray(dresults)) {
                    dresults = [dresults];
                }
            } 
            if (responseObject.response.body.EnumerationResults.Blobs.Blob) {
                bresults = responseObject.response.body.EnumerationResults.Blobs.Blob;
                if (!_.isArray(bresults)) {
                    bresults = [bresults];
                }
            }

            dresults.forEach(function (currentBlob) {
                var blobResult = BlobResult.parse(currentBlob);
                responseObject.listBlobsResult.entries.directories.push(blobResult);
            });

            bresults.forEach(function (currentBlob) {
                var blobResult = BlobResult.parse(currentBlob);
                responseObject.listBlobsResult.entries.blobs.push(blobResult);
            });

            if (responseObject.response.body.EnumerationResults.NextMarker) {
                responseObject.listBlobsResult.continuationToken = {
                    nextMarker: null,
                    targetLocation: null
                };

                responseObject.listBlobsResult.continuationToken.nextMarker = responseObject.response.body.EnumerationResults.NextMarker;
                responseObject.listBlobsResult.continuationToken.targetLocation = responseObject.targetLocation;
            }
        }

        var finalCallback = function (returnObject) {
            callback(returnObject.error, returnObject.listBlobsResult, returnObject.response);
        };

        next(responseObject, finalCallback);
    };

    this.performRequest(webResource, null, options, processResponseCallback);
}

module.exports = BlobService;

