import React from 'react';
import PropTypes from 'prop-types';
import { toJS, decorate } from 'mobx';
import { observer } from 'mobx-react';
import { FileInfo } from './fileInfo';
import { FileFooter } from './fileFooter';
import { store } from '../FileStore';

const maxFilesInPage = 20;
@observer
export class FilePanel extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        // array of directories, with string: name 
        directories: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        // array of files, with object in shape of string: name, string: fileName
        files: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        // current path
        path: PropTypes.string
    }

    render() {
        const lowerBound = (store.activePage - 1) * maxFilesInPage,
            upperBound = store.activePage * maxFilesInPage;
        var { directories, files } = this.props,
            index = 0;
        directories = toJS(directories)[store.currentPath];
        files = toJS(files)[store.currentPath];

        if (!directories || !files)
            return null;
        return (directories.length + files.length) > 0 ? (
            <div style={ { minHeight: '40vh' } }>
                { directories.map(dir => {
                    index++;
                    return (index > upperBound || index <= lowerBound) ? 
                        null :
                        <FileInfo
                            key={ dir.name } 
                            id={ dir.name }
                            isDir={ true } 
                            selected={ dir.selected }
                            fileName={ dir.name }
                            path={ dir.path }/>
                    }
                ) }
                { files.map(file => {
                    index++;
                    return (index > upperBound || index <= lowerBound) ? 
                        null :
                    <FileInfo 
                        key={ file.id }
                        id={ file.id }
                        selected={ file.selected }
                        name={ file.name } 
                        fileName={ file.name }
                        previewPath={ file.previewPath }
                        path={ file.path }/>
                    }
                ) }
                <FileFooter activePage={ store.activePage }
                            maxPage={Math.ceil((directories.length + files.length) / maxFilesInPage)}
                            maxPageDisplay={5}/>
            </div>
        ) : (
            <div style={ { height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' } }>
                <div style={ { color: '#aaa' } }>沒有結果</div>
            </div>
        );
    }
};