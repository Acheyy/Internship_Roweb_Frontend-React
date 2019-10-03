import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import userActions from '../../actions/user';

@connect(
    store => ({
        user: store.user.user
    }),
    dispatch => ({
        ...bindActionCreators(userActions, dispatch)
    })
)
export default class Logout extends Component {
    constructor(props) {
        super(props);

        if (!props.user) {
            props.history.push("/login");
        } else {
            const {logoutUser} = props;

            logoutUser();
        }
    }

    componentDidUpdate() {
        if (!this.props.user) {
            this.props.history.push("/login");
        } else {
            const {logoutUser} = this.props;

            logoutUser();
        }
    }

    render() {
        return (
            null
        );
    }
}