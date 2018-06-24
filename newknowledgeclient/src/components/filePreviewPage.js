import React from 'react';
import { store } from '../FileStore';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf';
import {Button, Glyphicon, OverlayTrigger, Popover} from 'react-bootstrap';

export class FilePreviewPage extends React.Component {
    constructor(props) {
        super(props);
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
    }

    state = {
        pageNumber: 1,
        numPages: null,
        scale: 1
    }

    static propTypes = {
        filePath: PropTypes.string
    }

    onDocumentLoad = ({ numPages }) => {
        console.log("loaded the file");
        this.setState({ numPages });
    }

    onPrev = function(e) {
        var pageNumber = this.state.pageNumber - 1;
        this.setState({ pageNumber });
    }

    onNext = function(e) {
        var pageNumber = this.state.pageNumber + 1;
        this.setState({ pageNumber });
    }

    onZoomIn = (e) => {
        var scale = this.state.scale;
        this.setState({ scale: scale + 0.25 });
    }

    onZoomOut = (e) => {
        var scale = this.state.scale;
        this.setState({ scale: scale - 0.25 });
    }

    onClickDownload = async (e) => {
        e.preventDefault();
        var path = this.props.filePath;
        var payload = await fetch(path)
        
        const blob = await (payload.blob());
        var blobData = new Blob([blob], {type: 'application/octet-stream'});
        var url = URL.createObjectURL(blobData);
        var data = window.URL.createObjectURL(blobData);
        var link = document.createElement('a');
        link.download = this.props.fileName;
        link.href = data;
        link.click();
        setTimeout(function() {
            window.URL.revokeObjectURL(data);
        }, 100);
    }

    render() {
        var { filePath, fileName } = this.props;
        var pageNumber = this.state.pageNumber;
        var numPages = this.state.numPages;
        var scale = this.state.scale;
        var self = this;
        if (!!filePath) {
            return (
                <div className="container">
                    <h3 className="text-center">{fileName}</h3>
                    <div className="pdf-btn-wrap clearfix">
                        <div className="pdf-next-prev">
                            
                            <Button type="button" onClick={self.onPrev} ><Glyphicon glyph="chevron-left" /></Button>
                            <Button type="button" onClick={self.onNext} ><Glyphicon glyph="chevron-right" /></Button>
                        </div>
                        <div className="pdf-page">
                            <p>Page {pageNumber} of {numPages} </p>
                        </div>
                        <div className="pdf-zoom" >    
                            <Button type="button" onClick={self.onZoomIn} ><Glyphicon glyph="zoom-in" /></Button>
                            <Button type="button" onClick={self.onZoomOut} ><Glyphicon glyph="zoom-out" /></Button>                  
                        </div>
                        <div className="pdf-download-wrap">    
                            <Button type="button" className="btn btn-default bg-danger"  id="download-link" onClick={self.onClickDownload} > <Glyphicon glyph="cloud-download" /></Button>                       
                        </div>
                    </div>
                    <Document file={filePath} onLoadSuccess={this.onDocumentLoad} >
                        <Page pageNumber={pageNumber} scale={scale} />
                    </Document>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h3>Nothing loaded!</h3>
                </div>
            )
        }
        
    }
}