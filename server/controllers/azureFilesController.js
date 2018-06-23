var azure = require('azure-storage');
var util = require('util');
var fs = require('fs');
var stream = require('stream')
var BrowserFileReadStream = require('../models/browserfilereadstream');
var AzureFileReader = require('../models/azureFileReader');

var azureFilesController = function() {
    function readConfig() {
        return JSON.parse(fs.readFileSync('./app.config', 'utf8'));
      }

    var runFileServiceUpload = function() {
        var fileService = azure.createFileService(readConfig().connectionString);
        var shareName = 'newknowledgeapp';
        
        fileService.createShareIfNotExists(shareName, function (error) {
            if (error) {
                console.log('An error occurred when creating the share');
            }
            else {
                console.log('2. Creating a directory under the root directory');
                fileService.createDirectoryIfNotExists(shareName, 'Data', function (error) {
                    if (error) {
                        console.log('An error occurred when creating the first sub-directory');
                    }
                    else {
                        var nextDirectoryName = 'Data/Documents';
                        fileService.createDirectoryIfNotExists(shareName, nextDirectoryName, function (error) {
                            if (error) {
                                console.log('An error occurred when creating the second sub-directory Documents');
                            }
                            else {
                                console.log('3. Uploading a file to the directory');
                                fileService.createFileFromLocalFile(shareName, nextDirectoryName, 'Makarenko-InfPro_2017.pdf', './data/Makarenko-InfPro_2017.pdf', function (error) {
                                    if (error) {
                                        console.log('An error occurred while creating the file to upload - ' + error.message);
                                    }
                                    else {
                                        console.log('4. List all files and directories in the root directory');
                                        listFilesAndDirectories(fileService, shareName, 'Data', null, null, null, function (error, results) {
                                            if (error) {
                                                console.log('Error occurred when listing all files: ' + error.message);
                                            }
                                            else {
                                                for (var i = 0; i < results.files.length; i++) {
                                                    console.log(util.format('  - %s (type: file)'), results.files[i].name);
                                                }
                                                for (var j = 0; j < results.directories.length; j++) {
                                                    console.log(util.format('  - %s (type: directory)'), results.directories[j].name);
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });

       
    }  

    function getFullCatalog(directoryName) {
        var fileService = azure.createFileService(readConfig().connectionString);

        var shareName = 'newknowledgeapp';
        var directory = directoryName ? decodeURI(directoryName) : '';
        var output = '';

        var reader = new AzureFileReader(fileService, shareName, directory);
        var promise = reader.listAllFilesAndDirectories().then(function(values) {
            console.log(values);
            return values;
        }).catch(function(error) {
            console.log(error);
        });

        return promise;
    }

    
    
    
    function listFilesAndDirectories(fileService, share, directory, token, options, output, callback) {
        
        var items = { files: [], directories: [] };
        fileService.listFilesAndDirectories()
        fileService.listFilesAndDirectoriesSegmented((share, directory, token, options, function(error, result) {
            items.files.push.apply(items.files, result.entries.files);
            items.directories.push.apply(items.directories, result.entries.directories);
        
            var token = result.continuationToken;
            if (token) {
            var x = '   Received a page of results. There are ' + result.entries.length + ' items on this page.'
            console.log(x);
            //output += x + '\n';
            return listFilesAndDirectories(fileService, share, directory, token, options, output, callback);
            } 
            else {
            var y = '   Completed listing. There are ' + items.files.length + ' files and ' + items.directories.length + ' directories.'
            console.log(y);
            //output += y + '\n';
            return(callback(null, items));
            }
            resolve(output);
        }))
        
        
    }


    
    

    function uploadFile(directoryName, file) {
        var fileService = azure.createFileService(readConfig().connectionString);

        var shareName = 'newknowledgeapp';
        var directory = directoryName ? decodeURI(directoryName) : '/';
        var uploader = new AzureFileReader(fileService, shareName, directory);

        var fileStream = new stream.Readable();
        fileStream.push(file.buffer);
        fileStream.push(null);
        var promise = uploader.uploadFileToDirectory(file.originalname, fileStream, file.buffer.length).then(result => console.log(result))
            .catch(function(error) {
                console.log(error);
            });
        return promise;
    }


    async function getFileLink(pathname) {
        var fileReq = decodeURI(pathname);
        var directory = fileReq.substr(0, fileReq.lastIndexOf('/'));
        var fileName = fileReq.substr(fileReq.lastIndexOf('/') + 1);
        var fileService = azure.createFileService(readConfig().connectionString);

        var shareName = 'newknowledgeapp';
        
        var reader = new AzureFileReader(fileService, shareName, directory);
        var dirExists = await reader.doesDirectoryExist().then(result => result.exists);
        var fileExists = dirExists ? await reader.doesFileExist(fileName) : false;
        if (dirExists && fileExists) {
            var startDate = new Date();
            var endDate = new Date(startDate);
            endDate.setMinutes(startDate.getMinutes() + 60);
            var sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: azure.FileUtilities.SharedAccessPermissions.READ, 
                    Start: startDate,
                    Expiry: endDate
                }
            };
            var token = fileService.generateSharedAccessSignature(shareName, directory, fileName, sharedAccessPolicy);
            var sasUrl = fileService.getUrl(shareName, directory, fileName, token);
            return sasUrl;
        }
        //TODO: improve this so a 404 doesn't break the server and leave the client hanging (metaphorically or literally)
        else {
            throw Error('The file or directory path specified was not found.');
        }
        
    }


    async function getFileDownload(pathname) {
        var fileReq = decodeURI(pathname);
        var directory = fileReq.substr(0, fileReq.lastIndexOf('/'));
        var fileName = fileReq.substring(fileReq.lastIndexOf('/') + 1);
        var shareName = 'newknowledgeapp';
        var fileService = azure.createFileService(readConfig().connectionString);

        var reader = new AzureFileReader(fileService, shareName, directory);
        var dirExists = await reader.doesDirectoryExist().then(result => result.exists);
        var fileExists = dirExists ? await reader.doesFileExist(fileName) : false;
        if (dirExists && fileExists) {
            var fileStream = reader.getFileToStream(fileName, fs.createWriteStream(fileName))
                .catch(error => console.log(error));
            return fileStream;
        }
        else {
            throw Error('The file specified was not found.');
        }
    }


    return {
        runFileServiceUpload: runFileServiceUpload,
        getFullCatalog: getFullCatalog, 
        uploadFile: uploadFile,
        getFileLink: getFileLink,
        getFileDownload: getFileDownload
    }
}

  
module.exports = azureFilesController;