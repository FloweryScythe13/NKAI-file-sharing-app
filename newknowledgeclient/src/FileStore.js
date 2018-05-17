import { observable, observe, autorun, computed, action, decorate } from 'mobx';
import React from 'react';
import request from 'superagent';

class FileViewStore {
    directories = observable.map();
    files = observable.map();
    currentPath = "";
    activePage = 1;
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

        //return request.get(`http://localhost:3000/path?base=${path}`)
        return fetch(`${path}`)
            .then(res => res.json())
            .then(res => {
                // alter this when in real application
                const { directories, files } = res.output;
                this.directories.set(path, directories);
                this.files.set(path, files);
            })
            .catch(err => {
                if (err.status === 403) {
                    window.location = "/";
                    return;
                }
            })
    }

    /**
     * when file is either selected or unselected
     * @param {string} id - name id
     * @param {string} path - path
     * @param {bool} isDir - isDir
     */
    async onFileSelected(id, path, isDir) {
        const clickItem = item => item.name === id; 
        if (isDir) {
            if (!this.directories.has(path))
                throw new Error('Directory not found.');
                //cannot read property 'path' of undefined here...
            var dirs = this.directories.get(path);
            var clickedDir = dirs.find(clickItem);
            var clickedPath = `${clickedDir.path}`,
                clicked = clickedDir.selected = !clickedDir.selected;
            await this.listDirectoryFiles(clickedPath, false);
            this.files.get(clickedPath).map(f => f.selected = clicked);
        } else {
            if (!this.files.has(path))
                throw new Error('File not found.');
            var files = this.files.get(path), 
                clickedFile = files.find(clickItem),
                clicked = clickedFile.selected = !clickedFile.selected,
                parentDirPath = path.substring(0, path.lastIndexOf('/')),
                parentDir = this.directories.get(parentDirPath ? parentDirPath : '/');
            if (path !== '/' && parentDir) {
                let dir = parentDir.find(item => item.path === path);
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
}

decorate(FileViewStore, {
    directories: observable,
    files: observable,
    currentPath: observable,
    activePage: observable,
    listDirectoryFiles: action.bound,
    onFileSelected: action.bound,
    onPageChange: action.bound
})

export var store = window.store = new FileViewStore;

autorun(() => {
    console.log('path changed --> ', store.currentPath);
})