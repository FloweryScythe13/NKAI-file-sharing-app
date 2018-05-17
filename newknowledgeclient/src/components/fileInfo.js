import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { CheckBox } from './checkbox';
import { store } from '../FileStore'; 
import { decorate } from 'mobx';

export const FileInfo = observer(class FileInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        // name in db, this is just a label, not a real file name
        name: PropTypes.string,
        // real filename
        fileName: PropTypes.string,
        // parent directory
        path: PropTypes.string,
        // is selected 
        selected: PropTypes.bool,
        // disabled select
        disabled: PropTypes.bool,
        // is directory
        isDir: PropTypes.bool,
        // preview path
        previewPath: PropTypes.string,
    } 

    static defaultProps = {
        fileName: 'unknown',
        selected: false,
        disabled: false,
        isDir: false
    }

    render() {
        const { id, name, fileName, path, selected, disabled, isDir, previewPath } = this.props;
        return (
            <div className='f-ele-wrapper' 
                onClick={ () => isDir ? null : 
                            store.onFileSelected(id, store.currentPath, isDir) }>
                <div className={ `f-ele${selected ? ' f-ele-selected' : ''}` }
                    onClick={ () => isDir ? store.listDirectoryFiles(path) : null }>
                    <p className='f-ele-preview' style={ isDir ? null : { backgroundImage: `url(${previewPath})` } }/>
                </div>
                <div className='f-ele-footer' 
                    onClick={ () => isDir ? store.onFileSelected(id, store.currentPath, isDir) : null }>
                    <CheckBox 
                        checked={ selected } 
                        text={ name || fileName }
                    />
                </div>
            </div>
        );
    }
});