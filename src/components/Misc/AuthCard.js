import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class AuthCard extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired
    };

    render() {
        const {title, className, children} = this.props;

        let classes = classNames('auth-card', className);

        return (
            <div className={classes}>
                <div className={'auth-card-title'}>{title}</div>
                <div className={'auth-card-content'}>
                    {children}
                </div>
            </div>
        );
    }
}