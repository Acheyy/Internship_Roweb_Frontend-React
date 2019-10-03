import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default class Checkbox extends Component {

    static propTypes = {
        text: PropTypes.string
    };

    _toggleCheck = () => {
        const {onChange, checked} = this.props;

        onChange && onChange(!checked);
    };

    _toggleModal = () => {
        const {toggleModal, showModal} = this.props;

        toggleModal && toggleModal(!showModal);
    };

    render() {
        const {disabled, checked, text, link} = this.props;

        return (
            <Fragment>
                {!link && <div className={'custom-checkbox-container'}
                               {...(!disabled ? {
                                   onClick: this._toggleCheck
                               } : {})}>
                    <div className={`custom-checkbox-box ${checked ? 'isChecked' : ''} ${disabled ? 'disabled' : ''}`}>
                        {!disabled && checked && <FontAwesomeIcon icon={"check"} className="custom-checkbox-checked"/>}
                    </div>
                    {text && <span className={'custom-checkbox-span'}>{text}</span>}
                </div>}
                {link && <div className={'custom-checkbox-container'}>
                    <div
                        {...(!disabled ? {
                            onClick: this._toggleCheck
                        } : {})}
                        className={`custom-checkbox-box ${checked ? 'isChecked' : ''} ${disabled ? 'disabled' : ''}`}>
                        {!disabled && checked && <FontAwesomeIcon icon={"check"} className="custom-checkbox-checked"/>}
                    </div>
                    {text && <Fragment>
                        <span
                            {...(!disabled ? {
                                onClick: this._toggleCheck
                            } : {})}
                            className={'custom-checkbox-span'}>
                            {text}
                        </span>
                        <span onClick={this._toggleModal} className={'link-to'}>
                            <a href="javascript: void(0);">{link}</a>
                        </span>
                    </Fragment>}
                </div>}
            </Fragment>
        );
    }
}
