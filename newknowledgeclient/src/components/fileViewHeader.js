import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { decorate } from 'mobx';
import { FileViewHeaderPath } from './fileViewHeaderPath';
import { Form, FormControl, FormGroup, Modal, Button, ButtonToolbar, ButtonGroup, Glyphicon, Collapse } from 'react-bootstrap';
import { FileUploadComponent } from './fileUploadComponent';
import { store } from '../FileStore';

@observer
export class FileViewHeader extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        
        this.state = {
            open: false
        };
    }
    
    static propTypes = {
        // current path
        path: PropTypes.string
    }

    static defaultProps = {
        path: '/'
    }

    handleClose() {
        this.setState({ open: false });
    }

    handleOpen() {
        this.setState({ open: true })
    }

    render() {
        const { path } = this.props;
        var that = this;
        return (
            <div className='f-head-wrapper'>
                <FileViewHeaderPath path={this.props.path}/>
                <br />
                <ButtonToolbar>
                    <ButtonGroup>
                    <div className="btn-group mr-1" role="group" aria-label="First group">
                        <button className='btn btn-light btn-sm'>
                            <Glyphicon glyph="chevron-up" />
                        </button>
                    </div>
                    <div className="btn-group mr-1" role="group" aria-label="Second group">
                        <button className='btn btn-light btn-sm'>
                            <Glyphicon glyph="refresh" />
                        </button>
                    </div>
                    <div className="btn-group mr-1 f-hide-if-sm" role="group" aria-label="Second group">
                        <Button className='btn btn-light btn-sm' disabled={store.selectedFile.length > 0} onClick={() => that.setState({open: !that.state.open })} >
                            <Glyphicon glyph="cloud-upload" />
                        </Button>
                    </div>
                    <Modal show={this.state.open} onHide={this.handleClose} >
                        <Modal.Header closeButton>
                            <Modal.Title>Upload File</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FileUploadComponent path={path} />
                        </Modal.Body>
                    </Modal>
                    </ButtonGroup>
                </ButtonToolbar>          
            </div>
        );
    }
} 