import { observable, observe, autorun, computed, action, decorate } from 'mobx';
import React from 'react';
import AxiosAPI from './axiosApi';
import history from './history';

class FileViewStore {
    directories = observable.map();
    files = observable.map();
    currentPath = "";
    activePage = 1;
    selectedFile = "";
    selectedFileName = "";
    isAuthenticated = false;
    /**
     * request for the files and folders under the specify directory.
     * @param {string} path - request directory path 
     * @param {boolean} pageChange - trigger page rendering
     */
    listDirectoryFiles(path, pageChange = true) {
        if (pageChange)
            this.currentPath = path;
        if (this.directories.has(path) && this.files.has(path)) {
            return;
        }
        var self = this;
        AxiosAPI.get(`/catalog/${path}`)
            .then(function(res) {
                
                const directories = res.data.directories;
                const files = res.data.files;
                
                self.directories.set(path, directories);
                self.files.set(path, files);
                return 0; 
            }, function(rejected) {
                console.log(rejected); 
            })
            .catch(err => {
                console.log(err);
                // if (err.status === 401) {
                //     window.location = "/";
                //     return;
                // }
            })
        return;
    }

    /**
     * when file is either selected or unselected
     * @param {string} id - id (equivalent to name)
     * @param {string} path - path
     * @param {bool} isDir - isDir
     */
    async onFileSelected(id, path, isDir) {
        const clickItem = item => item.name === id; 
        if (isDir) {
            if (!this.directories.has(path))
                throw new Error('Directory not found.');
            var dirs = this.directories.get(path); 
            var clickedDir = dirs.find(clickItem);
            var clickedPath = `${clickedDir.path}`;
            var clicked = clickedDir.selected = !clickedDir.selected;
            await this.listDirectoryFiles(clickedPath, false);
            this.files.get(clickedPath).map(f => f.selected = clicked);
        } else {
            if (!this.files.has(path))
                throw new Error('File not found.');
            var files = this.files.get(path); 
            var clickedFile = files.find(clickItem);
            //var clicked = clickedFile.selected = !clickedFile.selected;
            var parentDirPath = path.substring(0, path.lastIndexOf('/')),
                parentDir = this.directories.get(parentDirPath ? parentDirPath : '/');
            if (path !== '/' && parentDir) {
                let dir = parentDir.find(item => item.path === path);
                this.getFileLink(clickedFile.path, clickedFile.name);
                if (!clicked) {
                    if (dir) dir.selected = false;
                } else {
                    if (!this.files.get(path).filter(f => f.selected == false).length)
                        dir.selected = true;
                }
            }
        }
    }

    /**
     * fire when page change is clicked
     * @param {Number} page - current page
     * @param {Number} maxPage - maximum page 
     */
    onPageChange(page, maxPage) {
        if (page > maxPage || page < 1)
            return;
        this.activePage = parseInt(page);
    }


    /**
     * When a file has been clicked on, get that file's URL from the API,
     * set it as the new value of the selectedFile observable, and render the
     * FilePreview component with that new URL (so that the nested PDF-reader
     * component can go read the file from Azure)
     * @param {string} path
     */
    getFileLink(path, name) {
        var self = this; 
        
        return AxiosAPI.post('/catalog/lookups', { filePath: path })
            .then(function(result) {
                self.selectedFile = result.data.fileUrl;
                self.selectedFileName = name;
            });
    }

    getFileDownload(path) {
        var self = this; 
        return AxiosAPI.post('/catalog/downloads', { fileUrl: path })
            .then(function(result) {
                console.log(result);
                //self.selectedFile = result.data.fileUrl;
            });
    }

    clearSelectedFile() {
        this.selectedFile = "";
    }


    isAuth() {
        this.isAuthenticated = true;
    }

    isNotAuth() {
        this.isAuthenticated = false;
        history.push('/login');
    }



}

decorate(FileViewStore, {
    directories: observable,
    files: observable,
    currentPath: observable,
    activePage: observable,
    selectedFile: observable,
    selectedFileName: observable,
    isAuthenticated: observable,
    listDirectoryFiles: action.bound,
    onFileSelected: action.bound,
    onPageChange: action.bound,
    getFileLink: action.bound,
    getFileDownload: action.bound,
    clearSelectedFile: action.bound,
    isAuth: action.bound,
    isNotAuth: action.bound
})

export var store = new FileViewStore;