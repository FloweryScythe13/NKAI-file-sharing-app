import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import { store } from '../FileStore';
import '../../node_modules/dropzone/dist/min/dropzone.min.css';
import '../../node_modules/react-dropzone-component/styles/filepicker.css';

export class FileUploadComponent extends React.Component {
    constructor(props) {
        super(props);

        this.djsConfig = {
            addRemoveLinks: true,
            acceptedFiles: "image/*,application/pdf,application/msword,.odt",
            params: {
                dir: this.props.path
            }
        }

        this.componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif', '.doc', '.pdf'],
            showFiletypeIcon: true,
            postUrl: `/catalog/upload${this.props.path}`
        }

        this.success = function(file) { 
            store.listDirectoryFiles(this.props.path);
        }
        this.added = function() {console.log('file added')};
        this.dropped = function() {console.log('file dropped into dropzone')}
        this.dropzone = null;

        this.success = this.success.bind(this);
        this.complete = () => store.listDirectoryFiles(this.props.path);
    }

    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            addedFile: this.added,
            success: this.success
        }
        return <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
    }
}