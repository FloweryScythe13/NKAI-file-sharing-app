import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import { store } from '../FileStore';

export class FileUploadComponent extends React.Component {
    constructor(props) {
        super(props);

        this.djsConfig = {
            addRemoveLinks: true,
            acceptedFiles: "image/*,application/pdf,application/msword,.odt"
        }

        this.componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif', '.doc', '.pdf'],
            showFiletypeIcon: true,
            postUrl: `/catalog/${this.props.path}`
        }

        this.success = file => console.log('uploaded', file);
        this.added = function() {console.log('file added')};
        this.dropped = function() {console.log('file dropped into dropzone')}
        this.dropzone = null;
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