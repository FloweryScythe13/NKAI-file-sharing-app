import React from 'react';
import { store } from '../FileStore';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf';
import {Button, Glyphicon} from 'react-bootstrap';

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

    render() {
        var filePath = this.props.filePath;
        var pageNumber = this.state.pageNumber;
        var numPages = this.state.numPages;
        var scale = this.state.scale;
        var self = this;
        console.log(filePath);
        console.log(pageNumber);
        if (!!filePath) {
            return (
                <div>
                    <h3>Preview Component</h3>
                    <div className="pdf-next-prev">
                        <p>Page {pageNumber} of {numPages} </p>
                        <Button type="button" onClick={self.onPrev} ><Glyphicon glyph="chevron-left" /></Button>
                        <Button type="button" onClick={self.onNext} ><Glyphicon glyph="chevron-right" /></Button>
                        <Button type="button" onClick={self.onZoomIn} ><Glyphicon glyph="zoom-in" /></Button>
                        <Button type="button" onClick={self.onZoomOut} ><Glyphicon glyph="zoom-out" /></Button>
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