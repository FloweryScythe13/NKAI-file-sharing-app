import React from 'react';
import PropTypes from 'prop-types';

export class CheckBox extends React.Component {
    static propTypes = {
        checked: PropTypes.bool,
        text: PropTypes.string
    }

    static defaultProps = {
        checked: false
    }

    render() {
        const { checked, text } = this.props;
        return (
            <div className="check-wrapper">
                <span className="check-text">{ text }</span>
                <input 
                    type="checkbox" 
                    checked={ checked } 
                />
                <span className="checkmark"></span>
            </div>
        );
    }
}