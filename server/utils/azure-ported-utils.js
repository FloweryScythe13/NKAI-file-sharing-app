var _ = require('underscore')
var Constants = require('azure-storage').Constants;
var SR = require('azure-storage').SR;
var util = require('util');

var exports = module.exports;

/**
* Set the value of an inner property of an object.
*
* @param {object} object   The target object.
* @param {array}  keys     The property chain keys.
* @param {mix}    object   The value to be set.
*
* @static

* @example
* // Set targetObject.propA.propB to 'testValue'
* var targetObject = {};
* util.setObjectInnerPropertyValue(targetObject, ['propA', 'propB'], 'testValue');
*/
exports.setObjectInnerPropertyValue = function(object, propertyChainKeys, value){
    if(!object || propertyChainKeys.length < 1) {
      return;
    }
  
    var currentKey = propertyChainKeys.shift();
    if(propertyChainKeys.length === 0) {
      object[currentKey] = value;
      return;
    }
    
    if (!object[currentKey]) {
      object[currentKey] = {};
    }
    
    exports.setObjectInnerPropertyValue(object[currentKey], propertyChainKeys, value);
  };

  /**
* Checks if a value is null, empty, undefined or consists only of white-space characters.
*
* @param {object} value The value to check for null, empty, undefined and white-space only characters.
* @return {bool} True if the value is an empty string, null, undefined, or consists only of white-space characters, false otherwise.
*/
exports.IsNullOrEmptyOrUndefinedOrWhiteSpace = function (value) {
    if(_.isNull(value) || _.isUndefined(value) || value === '') {
      return true;
    }
  
    if(_.isString(value) && value.trim().length === 0) {
      return true;
    }
  
    return false;
  };


exports.normalizeArgs = function (optionsOrCallback, callback, result) {
    var options = {};
    if(_.isFunction(optionsOrCallback) && !callback) {
      callback = optionsOrCallback;
    } else if (optionsOrCallback) {
      options = optionsOrCallback;
    }
  
    result(options, callback);
};

/**
* Checks if a value is null or undefined.
*
* @param {object} value The value to check for null or undefined.
* @return {bool} True if the value is null or undefined, false otherwise.
*/
exports.objectIsNull = function (value) {
    return _.isNull(value) || _.isUndefined(value);
};

exports.getNextListingLocationMode = function (token) {
    if(_.isNull(token) || _.isUndefined(token)) {
        return Constants.RequestLocationMode.PRIMARY_OR_SECONDARY;
    }
    else {
        switch (token.targetLocation) {
        case Constants.StorageLocation.PRIMARY:
        return Constants.RequestLocationMode.PRIMARY_ONLY;
        case Constants.StorageLocation.SECONDARY:
        return Constants.RequestLocationMode.SECONDARY_ONLY;
        default:
        throw new RangeError(util.format(SR.ARGUMENT_OUT_OF_RANGE_ERROR, 'targetLocation', token.targetLocation));
        }
    }
};


/**
* The list of the properties should be normalized with explicit mapping
*/
var normalizePropertyNameExceptionList = {
    'x-ms-blob-sequence-number': 'sequenceNumber',
    'content-Type': 'contentSettings.contentType',
    'content-Encoding': 'contentSettings.contentEncoding',
    'content-Language': 'contentSettings.contentLanguage',
    'cache-Control': 'contentSettings.cacheControl',
    'content-Disposition': 'contentSettings.contentDisposition',
    'content-MD5': 'contentSettings.contentMD5',
    'leaseId': 'lease.id',
    'leaseStatus': 'lease.status',
    'leaseDuration': 'lease.duration',
    'leaseState': 'lease.state',
    'copyId': 'copy.id',
    'copyStatus': 'copy.status',
    'copySource': 'copy.source',
    'copyProgress': 'copy.progress',
    'copyCompletionTime': 'copy.completionTime',
    'copyStatusDescription': 'copy.statusDescription',
    'copyDestinationSnapshot': 'copy.destinationSnapshot',
    'publicAccess': 'publicAccessLevel',
    'incrementalCopy': 'isIncrementalCopy'
  };

/**
* Normalize the property name from XML to keep consistent with 
* the name defined in the property headers
*/
exports.normalizePropertyNameFromXML = function (propertyName) {
    if (this.IsNullOrEmptyOrUndefinedOrWhiteSpace(propertyName)) {
      return '';
    }
    
    propertyName = propertyName.trim();
    propertyName = propertyName[0].toLowerCase() + propertyName.substring(1);
    // So far the cases are:
    //   for the 'last-modified' property in listing resources
    //   for the 'content-*' properties in listing resources
    //   for the 'cache-control' property in listing blobs
    //   for the 'x-ms-blob-sequence-number' in listing blobs
    if (propertyName in normalizePropertyNameExceptionList) {
      return normalizePropertyNameExceptionList[propertyName];
    } else if (propertyName.toLowerCase().indexOf('-') != -1) {
      return propertyName.replace('-', '');
    } else {
      return propertyName;
    }
  };


/**
* Set the property value from XML
*/
exports.setPropertyValueFromXML = function (result, xmlNode, toNormalize) {
  for (var subPropertyName in xmlNode) {
    if (xmlNode.hasOwnProperty(subPropertyName)) {
      if (toNormalize) {
        var propertyChain = this.normalizePropertyNameFromXML(subPropertyName).split('.');
        exports.setObjectInnerPropertyValue(result, propertyChain, xmlNode[subPropertyName]);
      } else {
        result[subPropertyName.toLowerCase()] = xmlNode[subPropertyName];
      }
      
      if (subPropertyName.toLowerCase() === 'copyprogress') {
        var info = this.parseCopyProgress(xmlNode[subPropertyName]);
        exports.setObjectInnerPropertyValue(result, ['copy', 'bytesCopied'], parseInt(info.bytesCopied));
        exports.setObjectInnerPropertyValue(result, ['copy', 'totalBytes'], parseInt(info.totalBytes));
      }
    }
  }
};