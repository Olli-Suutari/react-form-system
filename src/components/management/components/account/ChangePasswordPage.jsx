import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, FormGroup, Label } from 'reactstrap';
import Formsy from 'formsy-react';
import FormsyInput from '../../../../shared/formsy';
import { savePassword } from '../../../../actions/PassResetActions';

export class ChangePasswordPageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            canSubmit: false,
            resultText: '',
        };
        this.sendPassword = this.sendPassword.bind(this);
        this.triggerFormSend = this.triggerFormSend.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.enableButton = this.enableButton.bind(this);
    }

    componentDidMount() {
        document.title = 'Uusi salasana | Draft';
    }

    componentWillReceiveProps(nextProps) {
        // Check if logging in status has changed.
        if (nextProps.passwordManagement.passwordChangeStatus !== this.props.passwordManagement.passwordChangeStatus) {
            // TO DO: max 6 connections on same browser:
            // https://www.quora.com/How-can-I-fix-the-error-waiting-for-available-sockets-in-Google-Chrome
            if (nextProps.passwordManagement.passwordChangeStatus === 2) {
                this.setState({
                    resultText: <h5 style={{ color: 'red' }}>Password reset failed.
                        Try to send a new link to your email.</h5>
                });
            }
            else if (nextProps.passwordManagement.passwordChangeStatus === 3) {
                this.setState({
                    resultText: <h5 style={{ color: 'green' }}>Password reset successful.
                        You can now log in with your new password.</h5>
                });
            }
        }
    }

    triggerFormSend() {
        // Set states from fields that use formsy.
        const formsyValues = this.refs.form.getModel();
        // For some reason, the button is not disabled when the page loads and thus sending empty form is possible.
        if (formsyValues.password) {
            this.setState({
                    password: formsyValues.password,
                    passwordCheck: formsyValues.passwordCheck,
                },
                // Callback to handleValidSubmit once setState is done for.
                this.sendPassword
            );
        }
        else {
            alert('You cannot send an empty form.');
        }
    }

    sendPassword() {
        const { dispatch } = this.props;
        const formData = this.state;
        const data = {
            hash: this.props.match.params.hash,
            formData,
        };
        dispatch(savePassword(data));
    }

    disableButton() {
        this.setState({ canSubmit: false });
    }

    enableButton() {
        this.setState({ canSubmit: true });
    }

    render() {
        const result = this.state.resultText;
        const inputSection = (<Formsy ref="form" onValid={this.enableButton} onInvalid={this.disableButton}>
            <FormGroup>
                <Label>Password</Label>
                <FormsyInput
                    name="password"
                    type="password"
                    validations={{
                        matchRegexp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/
                    }}
                    validationError="Password must contain at least 6 characters, both large and small letters and  a number."
                />
                <Label>Confirm password</Label>
                <FormsyInput
                    name="passwordCheck"
                    type="password"
                    validations="equalsField:password"
                    validationError="Passwords do not match"
                />
            </FormGroup>
            <Button type="submit" className="button" href="#" target="_self" disabled={!this.state.canSubmit}
                    onClick={this.triggerFormSend}>Change password</Button>
        </Formsy>);
        return (
            <div className="login-page">
                <div className="form">
                    <p>You may change your password by typing the new password twice and clicking the button.</p>
                    <br />
                    {inputSection}
                    <br />
                    {result}
                    <span className="message">
                    <Link to="/management/login">Back to login page.
                </Link></span>
                    <br />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({ passwordManagement: state.passwordManagement });

export default connect(mapStateToProps)(ChangePasswordPageContainer);
