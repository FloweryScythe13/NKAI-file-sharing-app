import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { store } from '../FileStore';
import { decorate } from 'mobx';

export const FileViewHeaderPath = observer(class FileViewHeaderPath extends React.Component {
    constructor(props) {
        super(props);
        ['renderPath', 'onPathBtnClick'].map(fn => this[fn] = this[fn].bind(this));
    }
    static propTypes = {
        // current path
        path: PropTypes.string,
        // path seperator
        splitBy: PropTypes.string
    }

    static defaultProps = {
        path: '/',
        splitBy: '/'
    }

    /**
     * fired when user click path btn
     * @param {String} fullPath current full path
     * @param {String} goTo go to user clicked path
     */
    onPathBtnClick(fullPath, goTo) {
        var arr = fullPath.split('/');
        var index = arr.indexOf(goTo);
        if (index === -1) {
            store.listDirectoryFiles('/');
            return;
        }
        arr.splice(index + 1, arr.length - index - 1);
        var result = arr.join('/');
        if (!result) {
            store.listDirectoryFiles('/');
            return;
        }
        store.listDirectoryFiles(result);
    }

    renderPath() {
        const { path, splitBy } = this.props;
        var arr = path.split(splitBy).filter(s => s);
        arr.splice(0, 0, '/');
        return arr.map((p, index) => 
            <React.Fragment key={ index }>
                <button type="button" 
                        className={`head-path-btn${!index ? ' head-path-btn-first' : ''}`}
                        onClick={ () => this.onPathBtnClick(path, p) }>
                    { p }
                </button>
                { 
                    index + 1 === arr.length ?
                    null : 
                    <i className='fa fa-angle-right'/>
                }
            </React.Fragment>
        );
    }

    render() {
        const { path } = this.props;
        return (        
            <div className='f-head-path'>
                { this.renderPath() }
            </div>
        );
    }
}); 