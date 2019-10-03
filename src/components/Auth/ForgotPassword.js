import React, {Component, Fragment} from 'react';
import AuthCard from "../Misc/AuthCard";
import {Button, FormGroup, Input, Label} from "reactstrap";
import uniqueId from 'react-html-id';
import {Link} from 'react-router-dom';
import http from "../../libs/http";

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        const jwt = sessionStorage.getItem('jwt');

        if (props.user || jwt) {
            this.props.history.push('/');
        }

        uniqueId.enableUniqueIds(this);

        this.state = {
            showCode: false,
            email: '',
            code: '',
            password: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.props.history.push('/');
        }
    }

    _onChange = e => {
        const {name, value} = e.target;

        this.setState({
            [name]: value
        });
    };

    _changeRender = (showCode) => {
        this.setState({
            showCode
        });
    };

    _forgot = async () => {
        const {email} = this.state;

        let data = {
            email
        };

        let res = await http.route('forgot-password').post(data);

        console.log(res);
        //TODO set show code true and message
    };

    _change = async () => {
        const {code, password} = this.state;

        let data = {
            code,
            password
        };

        let res = await http.route('change-password').post(data);

        console.log(res);

        //Todo redirect login with message
    };

    _renderMain() {
        const {email} = this.state;

        return (
            <Fragment>
                <FormGroup>
                    <Label for={this.nextUniqueId()}>Email</Label>
                    <Input type="email" name="email" value={email} id={this.lastUniqueId()}
                           placeholder="Email..." onChange={this._onChange}/>
                </FormGroup>
                <Button onClick={this._forgot}>Submit</Button>
                <Link to={'login'}>Login</Link>
                <span onClick={() => this._changeRender(true)}>Have a code?</span>
            </Fragment>
        );
    }

    _renderCode() {
        const {code, password} = this.state;

        return (
            <Fragment>
                <FormGroup>
                    <Label for={this.nextUniqueId()}>Code</Label>
                    <Input type="text" name="code" value={code} id={this.lastUniqueId()}
                           placeholder="Code..." onChange={this._onChange}/>
                </FormGroup>
                <FormGroup>
                    <Label for={this.nextUniqueId()}>New password</Label>
                    <Input type="password" name="password" value={password} id={this.lastUniqueId()}
                           placeholder="New password..." onChange={this._onChange}/>
                </FormGroup>
                <Button onClick={this._change}>Change password</Button>
                <Link to={'login'}>Login</Link>
                <span onClick={() => this._changeRender(false)}>Try again</span>
            </Fragment>
        );
    }

    render() {
        const {showCode} = this.state;

        return (
            <AuthCard title="Forgot password">
                {!showCode && this._renderMain()}
                {showCode && this._renderCode()}
            </AuthCard>
        );
    }
}