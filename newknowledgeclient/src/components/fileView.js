import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
// import { FileViewHeader } from './fileViewHeader';
import { FileViewHeaderPath } from './fileViewHeaderPath';
import { FilePanel } from './filePanel';
import { store } from '../FileStore';
import { decorate } from 'mobx';


export const FileView = observer(class FileView extends React.Component {
    constructor(props) {
        super(props);
        store.listDirectoryFiles('/catalog');
    }
    
    render() {
        return (
            <div className='f-panel'>
                <FileViewHeaderPath path={store.currentPath}/>
                <FilePanel directories={store.directories} files={store.files}/>
            </div>
        );
    }
});