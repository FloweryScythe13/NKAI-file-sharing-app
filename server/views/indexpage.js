import React from 'react';
import ReactDOM from 'react-dom';
import { FileManager, FileNavigator } from '@opuscapita/react-filemanager'
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1'

const apiOptions = {
    ...connectorNodeV1.apiOptions, 
    apiRoot: 'http://opuscapita-filemanager-demo.azurewebsites.net/api'
}

const fileManager = (
    <div style={{ height: '480px' }}>
        <FileManager>
            <FileNavigator
                id="filemanager-1"
                api={connectorNodeV1.api}
                apiOptions={apiOptions}
                capabilities={connectorNodeV1.capabilities}
                initialResourceId={'Lw'}
                listViewLayout={connectorNodeV1.listViewLayout}
                viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
            />
        </FileManager>
    </div>
);

ReactDOM.render(fileManager, document.getElementById('app'));