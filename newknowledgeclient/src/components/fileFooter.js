import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { store } from '../FileStore';

export class FileFooter extends React.Component {
    constructor(props) {
        super(props);
        this.renderPages = this.renderPages.bind(this);
    }

    static propTypes = {
        activePage: PropTypes.number,
        maxPage: PropTypes.number,
        maxPageDisplay: PropTypes.number
    }

    static defaultProps = {
        activePage: 1,
    }

    renderPages() {
        const { activePage, maxPage, maxPageDisplay } = this.props;
        var begin = activePage - parseInt(maxPageDisplay / 2),
            end = activePage + parseInt(maxPageDisplay / 2),
            ele = [];
        begin < 1 ? begin = 1 : null;
        end > maxPage ? end = maxPage : null;
        for (var i = begin; i <= end; ++i) {
            ele.push(<span key={i} 
                            className={i === activePage ? 'active' : null}
                            onClick={ (e) => store.onPageChange(e.target.innerHTML) }>
                        {i}
                    </span>);
        }
        return ele;
    }

    render() {
        const { maxPage } = this.props;
        return maxPage < 1 ? null : (
            <div className="pagination">
                <span onClick={ () => store.onPageChange(1, maxPage) }>&laquo;</span>
                <span onClick={ () => store.onPageChange(store.activePage - 1, maxPage)}>&lt;</span>
                { this.renderPages() }
                <span onClick={ () => store.onPageChange(store.activePage + 1, maxPage) }>&gt;</span>
                <span onClick={ () => store.onPageChange(maxPage, maxPage) }>&raquo;</span>
            </div>            
        );
    }
}