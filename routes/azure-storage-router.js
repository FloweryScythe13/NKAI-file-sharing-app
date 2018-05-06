var azure = require('azure-storage');
var util = require('util');
var fs = require('fs');

var azureStorage = function() {
    function readConfig() {
        return JSON.parse(fs.readFileSync('./app.config', 'utf8'));
      }

    var runFileServiceUpload = function() {
        var fileService = azure.createFileService(readConfig().connectionString);
        var shareName = 'newknowledgeapp';
        fileService.
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

    var getFullCatalog = function() {
        var fileService = azure.createFileService(readConfig().connectionString);

        var shareName = 'newknowledgeapp';
        var directory = '/';
        var output = '';
        listFilesAndDirectories(fileService, shareName, directory, null, null, output, function (error, results) {
            if (error) {
                console.log('Error occurred when listing all files: ' + error.message);
            }
            else {
                var x = '';
                var y = '';
                for (var i = 0; i < results.files.length; i++) {
                    x = results.files[i].name;
                    output += x + '\n'; 
                    console.log(util.format('  - %s (type: file)'), results.files[i].name);
                }
                for (var j = 0; j < results.directories.length; j++) {
                    y = results.directories[j].name;
                    output += y + '\n'; 
                    console.log(util.format('  - %s (type: directory)'), results.directories[j].name);
                }
            }
        })
        return output;
    }
    
    
    function listFilesAndDirectories(fileService, share, directory, token, options, output, callback) {
        var items = { files: [], directories: []};
        
        fileService.listFilesAndDirectoriesSegmented(share, directory, token, options, function(error, result) {
          items.files.push.apply(items.files, result.entries.files);
          items.directories.push.apply(items.directories, result.entries.directories);
      
          var token = result.continuationToken;
          if (token) {
            var x = '   Received a page of results. There are ' + result.entries.length + ' items on this page.'
            console.log(x);
            output += x + '\n';
            listFilesAndDirectories(fileService, share, directory, token, options, callback);
          } 
          else {
            var y = '   Completed listing. There are ' + items.files.length + ' files and ' + items.directories.length + ' directories.'
            console.log(y);
            output += y + '\n';
            callback(null, items);
          }
        });
    }

    return {
        runFileServiceUpload: runFileServiceUpload,
        getFullCatalog: getFullCatalog
    }
}

  
module.exports = azureStorage;