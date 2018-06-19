//Use this class to wrap all continuation tokens/callbacks with Promises
function AzureFileReader(fileService, shareName, directoryName) {
    this.fileService = fileService;
    this.shareName = shareName;
    this.directoryName = directoryName;
    this.items = { files: [], directories: [] }
}
//Use this class to retrieve the files and directories and turn the result directly into a promise
AzureFileReader.prototype.retriever = function(token) {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.fileService.listFilesAndDirectoriesSegmented(self.shareName, self.directoryName, token, null, function(error, result) {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve(result);
            }
        })
    });
};

//Recursively read the results from retriever
AzureFileReader.prototype.listAllFilesAndDirectories = function(token) {
    var self = this;
    function handler(r) {
        self.items.files.push.apply(self.items.files, r.entries.files);
        self.items.directories.push.apply(self.items.directories, r.entries.directories);
        self.items.files.forEach(file => file.path = self.directoryName + '/' + file.name);
        self.items.directories.forEach(dir => dir.path = self.directoryName + '/' + dir.name);
        if (r.continuationToken) {
            return self.listAllFilesAndDirectories(r.continuationToken);
        }
        else {
            return self.items;
        }
    }

    return this.retriever(token).then(handler);
}

AzureFileReader.prototype.uploadFileToDirectory = function(fileName, stream, streamSize) {
    var self = this;
    
    return new Promise((resolve, reject) => {
       self.fileService.createFileFromStream(self.shareName, self.directoryName, fileName, stream, streamSize, function(error, result) {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                console.log(result);
                resolve(result);
            }
       })
    })
}

AzureFileReader.prototype.doesDirectoryExist = async function() {
    var self = this;
    return new Promise((resolve, reject) => {
        self.fileService.doesDirectoryExist(self.shareName, self.directoryName, function(error, result) {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve(result);
            }
        })
    })
}

AzureFileReader.prototype.doesFileExist = async function(file) {
    var self = this;
    return new Promise((resolve, reject) => {
        self.fileService.doesFileExist(self.shareName, self.directoryName, file, function(error, result) {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve(result);
            }
        })
    })
};


AzureFileReader.prototype.getFileToStream = async function(file, writeStream) {
    var self = this;
    return new Promise((resolve, reject) => {
        self.fileService.getFileToStream(self.shareName, self.directoryName, file, writeStream, function(error, serverFile) {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve(serverFile);
            }
        })
    })
}

module.exports = AzureFileReader;
