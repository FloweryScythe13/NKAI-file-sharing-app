import React from 'react';
import Box from 'react-layout-components';
import { PageHeader } from 'react-bootstrap';

export class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            
                    <div>
                        <PageHeader>Home</PageHeader>
                        <p>This is the home page</p>
                    </div>
            
        );
    }
}